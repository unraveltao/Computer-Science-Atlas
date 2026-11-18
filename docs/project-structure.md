# 项目结构

```text
content/
├── index.md                         # 网站统一首页
├── Start-Here/                      # Welcome 与写作指南
├── Computer-Science/
│   ├── index.md                     # 14 个领域的统一导航
│   └── <approved-domain>/index.md   # 一级领域入口与知识规划
└── assets/                          # 共享资源、插图与品牌资产

docs/                                # 工程、内容、资源与部署说明
quartz/                              # Quartz v5 网站实现
.github/workflows/deploy.yml         # GitHub Pages 自动部署
```

`content/` 存放网站发布内容；项目根目录、`quartz/` 和 `docs/` 存放网站实现及维护说明。

## 已批准的一级知识领域

`Computer-Science/` 下固定包含以下 14 个一级领域目录：

1. `00-Mathematical-Foundations/`
2. `01-Theoretical-Computer-Science/`
3. `02-Computer-Architecture-and-Organization/`
4. `03-Programming-Languages/`
5. `04-Data-Structures-and-Algorithms/`
6. `05-Operating-Systems/`
7. `06-Computer-Networks/`
8. `07-Databases-and-Storage/`
9. `08-Software-Engineering/`
10. `09-Software-Architecture-and-Distributed-Systems/`
11. `10-Security-and-Reverse-Engineering/`
12. `11-AI-and-Agent-Engineering/`
13. `12-Application-Development/`
14. `13-Infrastructure-and-Operations/`

每个一级目录先以一个 `index.md` 说明范围、代表性主题、领域边界、跨领域链接和建设状态。知识文章选择一个主要归档领域，其他关联通过链接表达；暂不预建二级目录。

主题专属资源放在相邻的 `assets/` 子目录；跨页面资源放在 `content/assets/` 下。详细约定见 `docs/content-guidelines.md` 与 `docs/asset-guidelines.md`。
