---
title: 服务拆分后的复杂性
description: 从订单系统拆分的故事理解分布式架构带来的能力、成本与故障语义。
tags:
  - computer-science
  - software-architecture
  - distributed-systems
modified: 2026-11-21
lang: zh-CN
---

# 服务拆分后的复杂性

> **阅读索引**：工程故事路线第 10 篇。前置：[设计模式是变化的边界](../08-Software-Engineering/design-patterns-as-change-boundaries.md)。下一篇：[用可观测性理解系统可靠性](../13-Infrastructure-and-Operations/observability-for-reliability.md)。

## 故事：订单系统拆成三个服务

单体应用部署变慢，团队把订单、库存和支付拆为独立服务。每个服务可以单独部署和扩容，但一次下单要多次网络调用。库存服务暂时不可用时，订单可能卡在“已支付、未扣库存”。

## 为什么要理解它

软件架构（Software Architecture）描述组件、责任边界及其关系。分布式系统将计算放到多个经网络通信的节点上，可能带来独立扩展与故障隔离，也引入通信失败、数据复制和跨服务状态管理。

## 核心原理

拆分服务把进程内调用变为网络交互。延迟、部分失败、版本兼容、身份验证和部署协调都进入系统行为。跨服务操作通常不能依赖单一数据库事务，需要定义状态推进、补偿或重试策略。

架构是质量属性之间的取舍。团队可能追求独立发布、隔离故障或按需扩展，也要承担额外运维和一致性复杂度。模块化单体也能有清晰边界，服务数量不是架构质量指标。

## 工程上解决什么

架构决策帮助确认哪些变化需独立发布，哪些组件需独立扩展，以及哪些故障要隔离。拆分前评估真实约束和团队运维能力；拆分后定义 API、超时、幂等、状态和观测责任。

## 常见误区

- 微服务并不天然比单体可靠；网络增加了故障模式。
- 服务越小不一定越灵活；协调、观测和治理成本也会增加。
- 重试无法自动解决跨服务事务，且可能重复副作用。

## 工程哲学：边界是责任契约，也是故障边界

每个边界都要说明所有者、输入输出、失败语义和观测方式。若边界只增加调用跳转，没有带来团队独立性或故障隔离，它可能不是有效拆分。

## 本篇小结与自测

1. 进程内调用变成网络调用后，多出哪些风险？
2. 什么证据可以支持服务拆分？
3. 网络重试为何要配合幂等？

## 知识关联与下一篇

架构描述组件如何协作，运维帮助判断协作是否正常。下一篇用日志、指标和追踪回答“系统正在变坏吗？”[用可观测性理解系统可靠性](../13-Infrastructure-and-Operations/observability-for-reliability.md)。

## 参考资料

- [CS2023：并行与分布式计算](https://csed.acm.org/knowledge-areas/)
- [Google SRE 书：分布式系统监控](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Microsoft Azure 架构中心：架构风格](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/)
