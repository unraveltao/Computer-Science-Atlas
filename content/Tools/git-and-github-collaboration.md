---
title: Git 与 GitHub 协作工作流
description: 从本地提交到 Pull Request，理解版本记录、并行协作与代码评审。
tags:
  - tools
  - git
  - github
modified: 2026-11-21
lang: zh-CN
---

# Git 与 GitHub 协作工作流

> **阅读索引**：Tools 实践文章。前置知识：[安全地推进软件改动](../Computer-Science/08-Software-Engineering/engineering-change-safely.md)。下一篇：[用 Codex 完成可审查的开发任务](./codex-assisted-development.md)。

## 故事：两个人同时修一个问题

小林修复订单折扣，小周调整订单页面。两人都要修改同一个项目。如果只靠发文件，谁的版本更新、哪些内容被覆盖、什么时候整合都会难以追踪。

Git 和 GitHub 把协作过程拆成可见的小步。Git 在本地记录项目快照；GitHub 托管远端仓库并提供讨论、评审和合并界面。Git 不依赖 GitHub 才能运行，GitHub 也不能替团队判断改动是否正确。

## 为什么要理解它

版本控制减少成果丢失、无关改动混杂和盲目合并的风险，也让团队能回答“谁改了什么、为什么改、如何验证”。

## 核心原理

提交（commit）记录一次项目状态及其元数据。分支（branch）是指向提交历史的引用，让多项工作可以独立推进。远端（remote）是本地仓库记录的另一个仓库地址。推送（push）发送本地提交，拉取（pull）获取并整合远端变化。

Pull Request（PR）是 GitHub 上提出和讨论一组改动的协作请求。它不是 Git 的核心对象，而是把分支差异、评审、自动检查和合并组织在一起。

## 一次安全的协作流程

~~~bash
git status
git switch -c fix/order-discount
# 编辑并检查改动
git diff
git add path/to/changed-file
git commit -m "fix: handle overlapping discounts"
git push -u origin fix/order-discount
~~~

之后在 GitHub 上创建 PR，说明问题、方案和验证方式。查看文件差异，回应评审意见，再按仓库规则合并。提交前检查状态和差异，避免把无关改动一起带入。

## 常见误区

- commit 保存在本地，push 才发送到远端。
- 分支通常是历史引用，不是额外复制一整套文件夹。
- PR 提供讨论和检查入口，但不自动保证功能正确。
- 自动检查通过不代表满足所有业务需求；还需要评审和适当的行为验证。

## 工程哲学：让改动可见、可讨论、可回退

小而聚焦的提交更容易审查；但过度切分也会增加整合成本。目标是让每组改动足够独立，使读者能说明它为何存在、如何验证。

## 本篇小结与自测

1. 没有网络时，哪些 Git 操作仍可用？
2. commit 与 push 有什么区别？
3. PR 的自动检查通过后，还要看什么？

## 知识关联与下一篇

本文讲工具工作流；版本控制的工程价值见[安全地推进软件改动](../Computer-Science/08-Software-Engineering/engineering-change-safely.md)。下一篇转向 AI 辅助开发：给 Codex 明确目标后，为什么仍需要人检查改动？

## 参考资料

- [Pro Git：分布式工作流](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows)
- [GitHub：编写和存储代码](https://docs.github.com/en/get-started/start-your-journey/writing-and-storing-your-code)
- [GitHub：审查 Pull Request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests)
