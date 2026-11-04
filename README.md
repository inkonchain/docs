[![Twitter](https://img.shields.io/twitter/follow/inkonchain)](https://x.com/inkonchain)

# InkChain Documentation App

An advanced, streamlined documentation platform built with Next.js and Nextra for InkChain.

## 📋 Requirements

* **Node.js**: v22.23.4 (pinned in [`.nvmrc`](.nvmrc); CI installs the same version)

## 📖 Overview

This is a documentation application powered by [Nextra](https://nextra.site/) and built on [Next.js](https://nextjs.org/). Nextra simplifies the creation of documentation sites, allowing us to leverage the **Pages Router** for efficient navigation and routing. Currently, due to compatibility limitations, we have not yet upgraded to the App Router.

## 🏁 Getting Started

To get started with local development:

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Start development server**:
   ```bash
   pnpm run dev
   ```

## 🛠 Tooling

Our development setup includes multiple tools to maintain high-quality code and documentation:

* **[CSpell](https://cspell.org/)**: Real-time spell checking to maintain documentation accuracy.
* **[Remark](https://remark.js.org/)**: Processes and renders Markdown content with added plugins.
* **[ESLint](https://eslint.org/)**: Ensures code quality by catching potential issues.
* **[Prettier](https://prettier.io/)**: Enforces consistent code formatting.
* **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for fast, responsive UI development.

## 🚦 CI/CD Pipeline

Our CI/CD setup utilizes GitHub Actions to run automated checks on every pull request (PR):

* **js-lint**: Lints JavaScript and TypeScript with ESLint.
* **md-lint**: Checks Markdown and MDX files with Remark.
* **format**: Checks code style with Prettier.
* **spell-check**: Uses CSpell to verify spelling in the documentation. For any unique terms (e.g., "InkChain"), add them to [`./cspell/project-words.txt`](./cspell/project-words.txt).

## 🌐 Feature Branch Deployment

For every new PR opened from a branch in this repository, our CI/CD pipeline deploys a temporary preview environment via **Vercel**. This real-time deployment enables live testing and review of changes before merging, ensuring a smoother workflow. The deployment URL is posted to the `vercel-preview` job's summary. Preview jobs are skipped for fork PRs because those runs cannot access the deploy token.

## 🚀 Production Deployment

The `main` branch is configured for automatic continuous deployment via **Vercel**. Every merge triggers a new build and deployment, ensuring that the latest version of the documentation is available to users without manual intervention.
