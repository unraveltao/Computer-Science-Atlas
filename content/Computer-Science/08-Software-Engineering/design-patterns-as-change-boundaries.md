---
title: 设计模式是变化的边界
description: 从新增通知渠道的故事理解设计模式何时隔离变化，何时反而增加复杂性。
tags:
  - computer-science
  - software-design
  - design-patterns
modified: 2026-11-21
lang: zh-CN
---

# 设计模式是变化的边界

> **阅读索引**：工程故事路线第 9 篇。前置：[安全地推进软件改动](./engineering-change-safely.md)。下一篇：[服务拆分后的复杂性](../09-Software-Architecture-and-Distributed-Systems/where-complexity-goes-when-splitting-services.md)。

## 故事：邮件通知之后又要发短信

订单系统起初只发邮件。新增短信后，开发者在订单流程里增加条件；再增加站内通知时，核心业务逻辑开始依赖每种发送方式的细节。

## 为什么要理解它

设计模式（Design Pattern）总结常见设计问题和可复用结构。它提供讨论词汇，却不是脱离场景的标准答案。模式的价值在于把变化点与稳定部分分开。

## 核心原理

可以定义通知接口，让邮件和短信各自实现发送行为；订单逻辑依赖接口而非具体渠道。策略模式（Strategy）封装可替换行为，依赖倒置鼓励高层规则依赖抽象。

如果系统只有一个渠道、没有替换需求，新增接口和工厂层可能只增加跳转成本。抽象应由真实变化、测试需要或依赖边界支撑。

## 工程上解决什么

合适的边界能减少条件分支扩散、支持单独测试和替换实现。先观察实际变化，再选择模式；随后检查新增行为是否能在不改动核心流程的情况下实现。

## 常见误区

- 代码出现 Strategy，不代表设计就更好。
- 每次变化都需要接口，会引入理解和维护成本。
- 设计原则用于发现风险，不是无需判断的硬性定律。

## 工程哲学：为真实变化建立抽象，不为想象中的未来付费

抽象是一项维护承诺。先用最小结构解决真实问题；变化证据出现后再提炼重复部分。好设计让常见变化更容易，同时不让简单路径更难。

## 本篇小结与自测

1. 示例中 Strategy 隔离了什么？
2. 哪些证据说明抽象值得引入？
3. 什么迹象说明模式成了负担？

## 知识关联与下一篇

本文讨论代码与模块层面。下一篇进入系统层：订单服务拆分后，网络、状态和部署边界会如何变化？[服务拆分后的复杂性](../09-Software-Architecture-and-Distributed-Systems/where-complexity-goes-when-splitting-services.md)。

## 参考资料

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.pearson.com/en-us/subject-catalog/p/design-patterns/P200000003258/9780201633610)
- [CS2023：软件工程领域](https://csed.acm.org/knowledge-areas/)
