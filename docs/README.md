# Documentation in this repository

This repository contains two kinds of documentation:

- **Computer Science Atlas content** lives in [`content/`](../content/) and is published as the website. It follows the project content and asset conventions.
- **Quartz framework documentation** also lives in this directory. These guides explain the upstream static-site generator used to build the Atlas; they are not Atlas learning articles and are not the source directory for the published site.

The site build reads `content/` by default. Use the Quartz guides when you need to understand or configure the framework. For contributor setup and the GitHub–Linear workflow, start with [`CONTRIBUTING.md`](../CONTRIBUTING.md). Atlas-specific content ownership and writing rules are maintained in the guides below; `AGENTS.md` provides repository instructions to coding agents.

## Atlas maintenance guides

- [Content guidelines](./content-guidelines.md) — writing, metadata, and archive requirements.
- [Knowledge architecture](./knowledge-architecture.md) — approved domain boundaries and cross-knowledge ownership.
- [Asset guidelines](./asset-guidelines.md) — image and diagram formats, storage, and references.
- [Deployment](./deployment.md) — current GitHub Pages build and deployment workflow.

GitHub Actions runs validation and build checks for pull requests. On pushes to `main`, the Pages workflow builds `content/` and deploys the generated site. The deployment workflow is configured in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml); these docs describe it but do not control it.

Quartz is licensed under the MIT License. See [`LICENSE.txt`](../LICENSE.txt) and preserve its copyright and attribution notices when redistributing the framework code and documentation.
