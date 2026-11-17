# Deployment

The GitHub Actions workflow at `.github/workflows/deploy.yml` builds on pushes to `main`, installs locked npm dependencies and Quartz plugins, runs `npx quartz build`, and deploys `public/` through GitHub Pages.

## One-time repository setting

In the repository on GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source if it is not already selected. The workflow cannot publish until Pages accepts Actions deployments.

The configured Quartz base URL is `unraveltao.github.io/Computer-Science-Atlas` (without a protocol), so the expected site address is `https://unraveltao.github.io/Computer-Science-Atlas/` after a successful workflow run.

## Local check

Run `npm ci`, then `npx quartz plugin install`, then `npx quartz build`. The generated `public/` directory is a local build artifact and is ignored by Git.
