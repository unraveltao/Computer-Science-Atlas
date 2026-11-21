---
title: 从工程故事理解计算机科学
description: 沿着订单服务从需求、执行到协作交付的故事，连接计算机基础、工程思想与开发工具。
tags:
  - learning-path
  - engineering
modified: 2026-11-21
lang: zh-CN
---

# 从工程故事理解计算机科学

这条路线从一个目标开始：做一个能可靠处理订单的服务。为了上线并持续演进，我们要回答：需求如何说清楚？程序如何变成机器动作？数据变多后怎样保持速度？多人如何协作并安全交付？

选题参考 ACM、IEEE-CS 与 AAAI 的 CS2023 知识领域框架，但阅读顺序围绕工程故事安排，并不照搬大学课程。

## 阅读路线

| 篇 | 工程问题 | 文章 |
| --- | --- | --- |
| 1 | 优惠规则会冲突吗？ | [先把需求说成明确条件](./00-Mathematical-Foundations/requirements-as-logic.md) |
| 2 | 源代码如何被机器执行？ | [从代码到机器动作](./02-Computer-Architecture-and-Organization/from-code-to-machine.md) |
| 3 | 编译器怎样读懂程序？ | [让程序结构可理解](./03-Programming-Languages/why-programming-languages-need-structure.md) |
| 4 | 为什么数据变多后系统变慢？ | [正确之外，还要考虑规模](./04-Data-Structures-and-Algorithms/algorithm-performance-tradeoffs.md) |
| 5 | 多个程序如何共享一台机器？ | [程序怎样共享一台机器](./05-Operating-Systems/processes-share-machine.md) |
| 6 | 一次网络请求在哪儿超时？ | [跟踪一次网络请求](./06-Computer-Networks/follow-a-network-request.md) |
| 7 | 如何避免重复下单和数据丢失？ | [事务如何保护数据变更](./07-Databases-and-Storage/transactions-and-durability.md) |
| 8 | 怎样让改动可控？ | [安全地推进软件改动](./08-Software-Engineering/engineering-change-safely.md) |
| 9 | 设计模式何时有用？ | [设计模式是变化的边界](./08-Software-Engineering/design-patterns-as-change-boundaries.md) |
| 10 | 服务拆分后复杂性去了哪里？ | [服务拆分后的复杂性](./09-Software-Architecture-and-Distributed-Systems/where-complexity-goes-when-splitting-services.md) |
| 11 | 如何发现线上服务变慢？ | [用可观测性理解系统可靠性](./13-Infrastructure-and-Operations/observability-for-reliability.md) |
| 12 | 多人如何安全地汇合改动？ | [Git 与 GitHub 协作工作流](../Tools/git-and-github-collaboration.md) |
| 13 | 如何用 Codex 辅助开发并审查结果？ | [用 Codex 完成可审查的开发任务](../Tools/codex-assisted-development.md) |

每篇文章从具体问题出发，解释原理、工程价值、例子和常见误区。读完后试着回答：没有这个知识，团队会承担什么代价？它又不能替我们做出什么决定？

工具操作属于 Tools 分支；Atlas 解释相关学科原理并链接到指南，不重复维护操作细节。

## 参考框架

- [CS2023 知识领域与课程框架](https://csed.acm.org/final-report/)
- [Atlas 的 14 个知识领域与归档边界](./index.md)
