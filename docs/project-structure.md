# Project Structure

This repository keeps publishable notes separate from Quartz implementation files.

- `content/` contains the homepage, starter pages, and approved knowledge notes.
- `content/Computer-Science/` is the subject-domain landing area. Detailed categories are intentionally not established yet.
- `content/assets/` holds reusable published assets, grouped into `shared/`, `illustrations/`, and `branding/`.
- `docs/` contains contributor and project operations guidance.
- `quartz/`, `quartz.config.yaml`, and the root package files provide the Quartz v5 site implementation.
- `.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages.

For a topic-specific illustration, keep an `assets/` folder beside that topic's Markdown. Use `content/assets/` for assets shared by multiple pages.
