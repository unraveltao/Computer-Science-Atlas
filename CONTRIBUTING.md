# 参与贡献

感谢你帮助改进计算机科学知识地图（Computer Science Atlas）。本项目以 `content/` 中的 Markdown 为公开知识内容，使用 Quartz 构建网站，并通过 GitHub Pages 发布。

## 项目目录

| 路径                 | 用途                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| `content/`           | Atlas 首页、14 个知识领域和公开文章；会被构建并发布                         |
| `quartz.config.yaml` | 网站标题、主题、插件和布局配置                                              |
| `quartz/`            | Quartz 网站生成器及其构建实现                                               |
| `docs/`              | Quartz 框架文档，以及 Atlas 维护指南；见 [`docs/README.md`](docs/README.md) |
| `.github/workflows/` | 内容检查、构建测试和 GitHub Pages 发布流程                                  |

发布站点只从 `content/` 读取知识页面。修改 Quartz 源码、网站配置或维护文档，不等同于新增 Atlas 知识文章。

## 环境要求与本地预览

- Node.js 22 或更高版本（CI 使用 Node.js 24）
- npm 10.9.2 或更高版本
- Git

在终端运行：

```bash
git clone https://github.com/unraveltao/Computer-Science-Atlas.git
cd Computer-Science-Atlas
npm ci
npm run install-plugins
npx quartz build --serve
```

Quartz 会构建网站并启动本地预览服务；终端会显示访问地址。修改 `content/` 下的 Markdown 后，预览会自动更新。按 `Ctrl+C` 停止服务。

只需生成一次静态站点时运行：

```bash
npx quartz build
```

生成的 `public/` 是构建产物，不要提交到 Git。

## 编写与校验内容

新增知识页面前，先确定它回答的核心问题和唯一主要归属。项目保留已批准的 14 个一级领域；不要直接新增、重命名或移动一级领域。跨领域关系通过链接表达，避免复制同一份知识内容。

请以以下维护文档作为规范来源：

- [内容归档规范](docs/content-guidelines.md)：语言、页面结构、归档和公开内容要求。
- [知识领域与归档边界](docs/knowledge-architecture.md)：14 个领域及 Atlas、Exploration、Tools、项目知识之间的内容归属。
- [图片与图示规范](docs/asset-guidelines.md)：资源格式、存放位置和图片说明文字。
- [网站内容编写示例](content/Start-Here/Authoring-Guide.md)：面向读者的 Markdown 功能示例，不替代以上维护规范。

内容提交前运行与改动相关的检查：

```bash
npm run validate-content
npm run check
npm test
npx quartz build
```

`npm run validate-content` 检查 Markdown 元数据、站内链接、Obsidian 双向链接及本地资源；`npm run check` 检查 TypeScript 类型和仓库格式；`npm test` 运行仓库测试；`npx quartz build` 验证生产构建。CI 会运行这些检查。若某项与改动无关或无法运行，请在 PR 中写明具体命令和原因，不要标记为已通过。

所有提交均视为可能公开发布。不要提交私人笔记、个人数据、凭据、本地 Obsidian 配置或 `public/` 构建目录。

## Issue、Linear 与 Pull Request

本项目使用 GitHub Issues 记录可公开讨论和关闭的仓库工作，使用 Linear 跟踪项目里程碑与整体进度。两边不会自动同步，创建或更新记录时需要手动放入对方链接。

1. 先在 [GitHub Issues](https://github.com/unraveltao/Computer-Science-Atlas/issues) 搜索相似问题。需要纳入里程碑的工作，同时在 Linear 创建对应 issue，并在两边互相添加链接；小型、临时的 GitHub 修复可以只使用 GitHub Issue。
2. 从 `main` 创建一个范围明确的分支，例如 `docs/contributor-guide`、`content/networking-basics` 或 `fix/broken-content-link`。
3. 提交 Pull Request 时，填写改动摘要、实际运行的检查及结果。在“Related issue”中写 GitHub Issue 编号，并附上对应 Linear issue 的链接（若有）。使用 `Closes #编号` 关联应随 PR 关闭的 GitHub Issue。
4. PR 创建或状态变化后，手动在对应 Linear issue 中添加 PR 链接并更新状态。合并后确认 GitHub Issue 和 Linear issue 都反映实际结果；PR 关闭并不代表 Linear 自动更新。
5. 等待项目维护者审查。除非维护者明确授权，不要自行合并 PR。

提交前可参考仓库的 [Pull Request 模板](.github/pull_request_template.md)。
