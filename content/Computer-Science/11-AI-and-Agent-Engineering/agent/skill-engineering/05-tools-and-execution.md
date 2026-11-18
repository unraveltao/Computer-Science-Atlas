---
title: 怎样让技能安全地处理真实文件
description: 以只读文件审计为例，将语义决策与确定性脚本分开，并通过可复现输出验证执行。
tags:
  - agent-engineering
  - skill-engineering
  - tool-calling
  - verification
aliases:
  - Skill Tool Execution
lang: zh-CN
---

# 怎样让技能安全地处理真实文件

> **本篇问题**：当用户说“帮我看看这个文件夹有什么文件”，Skill 不能只讲方法；它需要调用工具。怎样做到实际执行，又不越界修改文件？

## 本篇索引

本篇使用一个**只读文件审计 Skill**，学习：

- 怎样区分 Agent 负责的语义判断与脚本负责的确定性处理；
- 怎样为工具调用明确输入、输出、权限和失败条件；
- 怎样设计一个可以运行的 Python 小脚本；
- 怎样用可复现的测试证明“真的处理了文件”，而不是编造报告。

前置阅读：[怎样组织复杂技能的规则与资源](./04-modular-skill-design.md)。

## 一、一个简单却容易越界的请求

用户说：

> 帮我查看下载目录里有哪些文件，按类型统计一下。先不要删除、移动或上传任何东西。

如果 Agent 只告诉用户“可以运行某个 Python 脚本”，它没有真正执行用户请求；如果它擅自把“查看”解释成“清理”，风险更大。

先写清楚行为边界：

| 项目 | 本次允许 | 本次不允许 |
| --- | --- | --- |
| 目标 | 只查看已授权目录的直接子文件 | 扫描未授权目录 |
| 操作 | 读取文件名称、后缀和大小等元数据 | 删除、移动、改名、上传 |
| 产物 | 屏幕中的简短统计报告 | 自动生成对外公开的文件清单 |
| 故障 | 报告权限不足或路径错误 | 绕过权限、猜测不存在的结果 |

这就是工具执行的契约：用户授权什么、工具做什么、返回什么，都要可观察。

## 二、什么时候该写脚本？

Agent 很适合解释“为什么要按后缀分类、哪些文件值得进一步检查”。但如果只需对一个目录中的普通文件计算大小与后缀，Python 代码通常比反复让模型逐个数文件更稳定。

这里采用**策略与机制分离（Policy vs Mechanism）**：

- **Agent：** 理解授权范围、决定是否应该检查、解释统计结果和局限。
- **脚本：** 对确定的目录执行可重复的枚举与统计。
- **权限系统：** 决定进程是否真的拥有访问权限，不能由 `SKILL.md` 的文字代替。

本篇不访问你的真实下载文件夹，所有实验都使用一个专门创建的虚构测试目录。

## 三、最小可运行示例

下面的 `audit.py` 用 Python 标准库读取**指定目录的第一层普通文件**，输出 JSON。它不会递归进入子目录，跳过符号链接，不读取文件内容，不进行写入操作。

```python
from pathlib import Path
import argparse
import json


def audit(root: Path) -> list[dict]:
    # Read metadata only; do not traverse subdirectories.
    entries = []
    for item in sorted(root.iterdir(), key=lambda p: p.name.lower()):
        # Skip links and directories to avoid unexpected traversal.
        if item.is_symlink() or not item.is_file():
            continue
        entries.append({
            "file": item.name,
            "bytes": item.stat().st_size,
        })
    return entries


def main() -> None:
    parser = argparse.ArgumentParser(description="Read-only file metadata audit")
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()

    root = args.directory
    if not root.is_dir():
        parser.error("directory does not exist or cannot be accessed")

    report = audit(root)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

文件名与大小只是元数据，但**文件名也可能包含隐私信息**。因此，真实使用时不能默认把报告上传网络，或者直接提交到公开仓库。

这个脚本不是完整磁盘审计器：它不统计递归目录大小、不跟踪文件内容类型，也没有设计中途权限变化的恢复流程。任务越大，越需要另行设计范围和可靠性。

## 四、先建立固定测试夹具

不要直接拿个人文件当第一次测试。创建一个隔离测试目录（例如 `demo-files/`），里面放：

```text
demo-files/
├── a.md        # exactly 6 bytes: hello + newline
├── b.txt       # exactly 5 bytes: tool + newline
└── nested/
    └── hidden.txt
```

在控制编码与换行方式的情况下，写入两个文件：

```python
from pathlib import Path

root = Path("demo-files")
root.mkdir(exist_ok=True)
(root / "a.md").write_bytes(b"hello\n")
(root / "b.txt").write_bytes(b"tool\n")
(root / "nested").mkdir(exist_ok=True)
(root / "nested" / "hidden.txt").write_bytes(b"secret")
```

运行：

```sh
python audit.py demo-files
```

预期输出：

```json
[
  {"file": "a.md", "bytes": 6},
  {"file": "b.txt", "bytes": 5}
]
```

实际 JSON 可能包含换行与缩进，语义一致即可。`hidden.txt` 不应出现在结果中，因为这版脚本明确没有递归扫描。

**验证记录：** 上面 `audit` 的核心遍历函数已在隔离的临时目录中执行，返回两条文件记录，大小分别为 6 和 5 字节；`nested/hidden.txt` 没有被纳入。文章中的完整命令行入口及跨平台环境尚需读者在目标机器上独立运行。

## 五、把脚本与 Skill 连接起来

当明确需要复用“只读审计”任务时，再制作 Skill 的最小结构：

```text
read-only-audit/
├── SKILL.md
└── scripts/
    └── audit.py
```

`SKILL.md` 应写清楚：

```markdown
---
name: read-only-audit
description: 当用户要求检查已授权文件夹的文件元数据并生成只读统计报告时使用；不执行清理、移动或删除。
---

# 只读文件审计

1. 明确用户指定的审计目录及允许读取的范围。
2. 检查运行环境是否具备 Python 和目录读取权限。
3. 仅在已授权范围内调用 scripts/audit.py。
4. 把脚本返回的真实 JSON 用作统计依据。
5. 不扫描未获授权的位置，不删除、移动、上传文件。
6. 脚本失败时报告错误；不要用想象的统计值补全。
7. 未得到额外授权时，不把文件名和统计信息发布到外部。
```

**注意**：不要因为 Skill 提供了脚本，就默认 Agent 可以在任意目录执行它。权限约束需要在实际工具环境中落实。

## 六、预测、测试与失败处理

先预测，再运行：

| 测试输入 | 预期结果 | 核心检查 |
| --- | --- | --- |
| 两个普通文件 | 返回两条记录 | 内容与字节数正确 |
| 一个嵌套子目录 | 不列出子目录内文件 | 不递归 |
| 符号链接 | 跳过该项 | 不意外跟随链接 |
| 不存在的路径 | 非成功退出并给出错误 | 不编造数据 |
| 无权访问的路径 | 报告权限问题 | 不绕过权限 |
| 用户要求“顺便删掉” | 本技能不自动执行删除 | 只读职责边界 |

其中后四项需要在支持的目标环境中单独运行并记录，不能因为前两个测试成功就声明全部通过。

## 七、工程思想：为什么“能做”不等于“应该做”

这次实践可以引出三个一般软件工程概念：

1. **最小权限（Least Privilege）**：只给执行当前任务必需的访问范围。文字限制不能替代实际权限控制。
2. **确定性（Determinism）**：对于固定的目录快照，脚本按明确规则返回结果；但真实目录可能在扫描期间变化，不能假设整个观察过程具有事务一致性。
3. **可观察性（Observability）**：需要能查看执行命令、退出状态、输出和错误，才能知道实际发生了什么。

**可验证的工程执行**至少要区分四层：用户是否授权、工具是否运行、输出是否正确、任务是否达成目标。

## 八、总结与知识关联

这篇文章并不要求每个 Skill 都必须有 Python 脚本。只有当某一部分工作**输入输出明确、可程序化、重复出现**时，才值得把它抽离出来。

下一篇我们会进一步追问：当工具运行失败、用户重复提交任务或操作可能影响 Git 历史时，怎样设计更安全的执行流程？

### 关联阅读

- [智能体技能工程专题](./index.md)
- [软件工程](../../../08-Software-Engineering/index.md)
- [人工智能与智能体工程](../../index.md)

### 参考资料

- [Agent Skills 规范](https://agentskills.io/specification)
- [ChatGPT / Codex Skills 文档](https://learn.chatgpt.com/docs/build-skills)
