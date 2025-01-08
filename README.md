# InkChain Documentation App

An advanced, streamlined documentation platform built with Next.js and Nextra for InkChain.

## 🚀 Build & Run

1. **Build Docker image**:
   ```bash
   docker build -t docs .
   ```

2. **Run Docker container**:
   ```bash
   docker run -p 3000:3000 docs
   ```

## 📋 Requirements

* **Node.js**: v20.11.0 or higher

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

* **js-lint**: Ensures proper JavaScript code formatting with ESLint.
* **md-lint**: Checks Markdown code formatting with Remark.
* **format**: Enforces consistent code style with Prettier.
* **spell-check**: Uses CSpell to verify correct spelling in documentation. For any unique terms (e.g., "InkChain"), add them to the [`./cspell/project-words.txt`](./cspell/project-words.txt) file to whitelist.

## 🌐 Feature Branch Deployment

For every new PR, our CI/CD pipeline deploys a temporary environment via **AWS Amplify**. This real-time deployment enables live testing and review of changes before merging, ensuring a smoother workflow. The deployment URL is automatically provided within the PR checks, allowing team members to interact with new features.

## 🚀 Production Deployment

The `main` branch is configured for automatic continuous deployment via **AWS Amplify**. Every merge triggers a new build and deployment, ensuring that the latest version of the documentation is available to users without manual intervention.
