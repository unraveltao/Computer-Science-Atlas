---
title: 用可观测性理解系统可靠性
description: 从“应用偶尔很慢”的反馈出发，理解日志、指标、追踪与可靠性目标如何形成证据。
tags:
  - computer-science
  - infrastructure
  - observability
modified: 2026-11-21
lang: zh-CN
---

# 用可观测性理解系统可靠性

> **阅读索引**：工程故事路线第 11 篇。前置：[服务拆分后的复杂性](../09-Software-Architecture-and-Distributed-Systems/where-complexity-goes-when-splitting-services.md)。下一篇：[Git 与 GitHub 协作工作流](../../Tools/git-and-github-collaboration.md)。

## 故事：用户说“今天页面很慢”

监控面板显示 CPU 平均值不高，但部分用户仍遇到长时间加载。平均值掩盖了慢请求；多个服务串联后，团队也不知道延迟来自数据库、网络还是应用逻辑。

## 为什么要理解它

可观测性（Observability）让团队根据系统输出推断内部状态。它不是安装几个采集工具后自动出现的能力；关键是数据能否回答运行问题。基础设施与运维负责让系统在部署后可观察、可维护和可恢复。

## 核心原理

日志记录离散事件和上下文；指标是随时间聚合的数值序列，适合趋势、告警和服务目标；分布式追踪把一次请求跨服务的操作关联起来，显示耗时和错误位置。它们提供不同视角，常需通过请求标识关联。

服务级指标（SLI）和服务级目标（SLO）可以描述用户可感知的成功率或延迟目标。定义要对应实际用户体验；资源利用率不能单独代表服务质量。

## 工程上解决什么

明确成功请求、延迟分位数和观察窗口，有助于发现退化、判断影响范围并安排响应。追踪定位慢链路，日志补充异常上下文，指标显示总体趋势。告警应指向可采取行动的问题，减少噪声。

## 常见误区

- 收集数据不等于能回答问题。
- 平均延迟可能遮住尾部请求。
- 告警越多不代表越可靠；噪声会造成告警疲劳。

## 工程哲学：把“感觉不对”转换成可行动证据

先从用户问题定义指标，再决定采集什么。目标不是更多仪表盘，而是更快理解影响、缩小假设范围并验证恢复。

## 本篇小结与自测

1. 日志、指标和追踪分别适合回答什么问题？
2. 为什么平均延迟会误导？
3. 什么样的告警值得打扰值班人员？

## 知识关联与下一篇

订单系统已经从需求走到线上运行。下一篇看看团队如何记录变更、协作审查并交付：[Git 与 GitHub 协作工作流](../../Tools/git-and-github-collaboration.md)。

## 参考资料

- [OpenTelemetry：信号概念](https://opentelemetry.io/docs/concepts/signals/)
- [Google SRE 书：分布式系统监控](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE 书：服务级目标](https://sre.google/sre-book/service-level-objectives/)
