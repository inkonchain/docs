# InkChain Docs App

## Build

```bash
docker build -t docs .
docker run -p 3000:3000 docs
```

## Requirements

- NodeJs (v20.11.0)

## Overview

This is a Next.js Documentation application built using [Nextra](https://nextra.site/), a tool that simplifies the process of creating documentation sites with Next.js. As we are utilizing Nextra, the application currently relies on the [Pages Router]() provided by Next.js for navigation and routing. Currently, we are not able to upgrade to use the App Router, due to it not being yet supported by Nextra.

## Getting Started

Clone this repository, install the dependencies, and start the development server with the following commands:

```bash
pnpm install
pnpm run dev
```

## Tooling

We are using a bunch of tools to enhance our development experience and to prevent us from pushing code with errors.
Here are some of the tools we are using:

- **[cspell](https://cspell.org/)**: for real-time spell checking and maintaining documentation quality.
- **[remark](https://remark.js.org/)**: for processing and rendering Markdown content with additional plugins.
- **[ESLint](https://eslint.org/)**: for enforcing code quality standards and catching potential issues.
- **[Prettier](https://prettier.io/)**: for enforcing code quality standards and catching potential issues.
- **[Tailwind CSS](https://tailwindcss.com/)**: for utility-first CSS styling and rapid UI development.

## CI/CD

We leverage GitHub Actions to perform some automated checks on all of our PRs. In particular, we run the following checks:

- **js-lint**: Run Eslint to make sure JS code is formatted correctly.
- **md-lint**: Run Remark to make sure Markdown code is formatted correctly.
- **format**: Run Prettier to make sure code is formatted correctly.
- **spell-check**: Run CSpell to make sure the content of our MDX files has the right spelling. Sometimes this command may fail for legit words (e.g. "inkchain") if that is the case, then we can simply add any word that we'd like to whitelist to the [`./cspell/project-words.txt`](./cspell/project-words.txt) file

### Feature Branch Deployment

Each pull request (PR) submitted to this repository triggers an automated deployment process through AWS Amplify. When a PR is opened or updated, AWS Amplify Console automatically deploys the changes to a unique, temporary hosting environment. This allows for real-time testing and review of the feature branch's changes in a live setting. The deployment URL is provided within the PR checks, enabling team members and stakeholders to interact with the new features before they are merged into the main branch.

This continuous deployment pipeline ensures that code is tested in a production-like environment early in the development cycle, helping to catch issues early and streamline the overall development process.

### Production Deployment

The application is set up for continuous deployment using AWS Amplify. Upon every merge into the `main` branch, AWS Amplify automatically triggers a new build and deploys the updated version of the application. This ensures that the latest documentation is always available to end-users without any manual intervention in the deployment process.
