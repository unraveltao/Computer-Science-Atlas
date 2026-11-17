# Computer Science Atlas

A subject-oriented, connected guide to computer science. The site uses Quartz v5 and Obsidian-compatible Markdown, so pages can be written in Obsidian and published as a static website.

**Website:** [Computer Science Atlas](https://unraveltao.github.io/Computer-Science-Atlas/)

## Stack

- Quartz v5 static site generator
- Obsidian-compatible Markdown, including wikilinks, callouts, tags, and Mermaid
- GitHub Actions and GitHub Pages

## Requirements

Use Node.js 22 or later and npm 10.9.2 or later, as required by the checked-in Quartz v5 package metadata. CI uses Node.js 24, following the official Quartz hosting workflow.

## Install

```sh
npm ci
npx quartz plugin install
```

## Develop locally

```sh
npx quartz build --serve
```

Quartz serves the local site at `http://localhost:8080`.

## Build

```sh
npx quartz build
```

The generated site is written to `public/` and is not committed.

## Deploy

Push to `main`. GitHub Actions installs dependencies and plugins, builds the site, and deploys it through GitHub Pages. Pages is configured to publish through GitHub Actions.

See [Project Structure](docs/project-structure.md), [Content Guidelines](docs/content-guidelines.md), [Asset Guidelines](docs/asset-guidelines.md), and [Deployment](docs/deployment.md) for conventions and maintenance details.
