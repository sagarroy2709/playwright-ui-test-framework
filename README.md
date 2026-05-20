# Playwright UI Test Framework

> Enterprise-grade UI automation framework built with Playwright + TypeScript, targeting [SauceDemo](https://www.saucedemo.com). Features Page Object Model, fixture-based dependency injection, multi-user authentication, cross-browser execution, and GitHub Actions CI/CD.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.59+-green?logo=playwright)
![Yarn](https://img.shields.io/badge/Yarn-4.14%20Berry-2C8EBB?logo=yarn)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-black?logo=githubactions)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Framework architecture](#framework-architecture)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running tests](#running-tests)
- [Reporting](#reporting)
- [CI/CD](#cicd)
- [Author](#author)

---

## Overview

This framework demonstrates a production-ready Playwright UI automation architecture. It covers:

- **Multi-user authentication** — six SauceDemo users are logged in once via a dedicated `auth.setup.ts` project; `storageState` is reused across all tests, eliminating redundant login steps
- **Page Object Model** — all page interactions are encapsulated in typed POM classes under `pages/`
- **Fixture-based dependency injection** — custom Playwright fixtures in `fixtures/` provide clean, reusable test context without boilerplate
- **Multi-browser execution** — Chromium, Firefox, and WebKit run in parallel; target browsers are selected via `--project` flag
- **Environment-aware config** — `.env` files per environment; `dotenv` loads the correct file at startup via `config/env.config.ts`
- **Dual reporting** — Playwright HTML reporter always active; Allure reporter enabled optionally via `ALLURE=true`
- **Trace on failure** — `trace: 'retain-on-failure'` captures a full Playwright trace for any failing test
- **Cross-platform scripts** — `cross-env` ensures all npm scripts work consistently on Windows, macOS, and Linux

---

## Tech stack

| Layer | Tool / Version |
|---|---|
| Test runner | Playwright `^1.59.1` |
| Language | TypeScript |
| Package manager | Yarn 4.14.1 (Berry) |
| Environment vars | dotenv |
| Cross-platform env | cross-env |
| Reporting | Playwright HTML + Allure (optional) |
| CI/CD | GitHub Actions |

---

## Framework architecture

```
┌─────────────────────────────────────────────┐
│              playwright.config.ts            │
│  projects: setup → chromium / firefox /     │
│            webkit (fully parallel)          │
└────────────────────┬────────────────────────┘
                     │
       ┌─────────────▼──────────────┐
       │      config/               │
       │  env.config.ts  ← .env.*   │
       │  auth.setup.ts  → .auth/   │
       └─────────────┬──────────────┘
                     │
       ┌─────────────▼──────────────┐
       │      fixtures/             │
       │  base fixture extends      │
       │  Playwright test with      │
       │  typed POM instances       │
       └─────────────┬──────────────┘
                     │
       ┌─────────────▼──────────────┐
       │      pages/                │
       │  LoginPage, InventoryPage  │
       │  CartPage, CheckoutPage    │
       │  … (POM classes)           │
       └─────────────┬──────────────┘
                     │
       ┌─────────────▼──────────────┐
       │      tests/                │
       │  *.spec.ts files           │
       │  import from fixtures/     │
       └────────────────────────────┘
```

### Key design decisions

**Auth setup as a dependency** — the `setup` project runs `auth.setup.ts` once before any browser project starts. It logs in all six SauceDemo users and writes their `storageState` to `.auth/`. Browser projects declare `dependencies: ['setup']`, so auth is never repeated mid-run.

**Fixture chaining** — `base.extend()` is used to compose fixtures, keeping test files clean and free of setup/teardown logic.

**Environment isolation** — `BASE_URL` and credentials are injected via `.env` files. Switching environments requires only changing the active `.env` file — no code changes.

---

## Project structure

```
playwright-ui-test-framework/
├── .github/
│   └── workflows/          # GitHub Actions CI pipeline
├── config/
│   ├── env.config.ts       # Loads .env file, validates BASE_URL
│   └── auth.setup.ts       # Logs in 6 users, writes .auth/*.json
├── fixtures/
│   └── index.ts            # Custom base fixture with POM instances
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── …                   # One class per page
├── reporter/               # Reporter configuration helpers
├── tests/
│   └── *.spec.ts           # Test specs — import from fixtures/
├── .env.example            # Environment variable template
├── .yarnrc.yml             # Yarn Berry config (nodeLinker: node-modules)
├── playwright.config.ts    # Projects, reporters, timeouts, browsers
├── tsconfig.json           # TypeScript config with path aliases
└── package.json            # Scripts and dependencies
```

---

## Prerequisites

- **Node.js** 18 or higher
- **Corepack** enabled (ships with Node.js 16.9+)

```bash
corepack enable
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/sagarroy2709/playwright-ui-test-framework.git
cd playwright-ui-test-framework

# 2. Install dependencies (Yarn 4 Berry — no npm install)
yarn install

# 3. Install Playwright browsers
yarn playwright install --with-deps
```

---

## Configuration

Copy the example env file and populate values:

```bash
cp .env.example .env
```

`.env.example`:

```env
BASE_URL=https://www.saucedemo.com
# Add any additional environment-specific variables here
```

> The framework supports multiple `.env` files (e.g. `.env.dev`, `.env.staging`). `env.config.ts` controls which file is loaded at startup.

---

## Running tests

All commands use Yarn scripts defined in `package.json`.

| Command | Description |
|---|---|
| `yarn test` | Run all tests across all configured projects |
| `yarn test:chromium` | Run tests on Chromium only |
| `yarn test:firefox` | Run tests on Firefox only |
| `yarn test:webkit` | Run tests on WebKit (Safari engine) only |
| `yarn test:allBrowsers` | Run tests across Chromium, Firefox, and WebKit |
| `yarn test:headedWithChromium` | Run Chromium tests in headed (visible browser) mode |
| `yarn test:ci` | Run with `CI=true` — enables 1 retry per failing test |

**Run a single test file:**

```bash
yarn playwright test tests/login.spec.ts
```

**Run tests matching a keyword:**

```bash
yarn playwright test --grep "add to cart"
```

---

## Reporting

### Playwright HTML report

Generated automatically after every run. Open with:

```bash
yarn playwright show-report
```

The report is saved to `playwright-report/` and includes screenshots, traces, and video for failing tests.

### Allure report (optional)

Install the Allure reporter package first:

```bash
yarn add -D allure-playwright
```

Then run with `ALLURE=true`:

```bash
cross-env ALLURE=true yarn test
```

Generate and open the Allure report:

```bash
npx allure generate allure-results --clean
npx allure open
```

### Trace viewer

Traces are retained on failure (`trace: 'retain-on-failure'`). Open a trace file with:

```bash
yarn playwright show-trace path/to/trace.zip
```

---

## CI/CD

The GitHub Actions pipeline (`.github/workflows/`) runs on every push and pull request to `main`.

**Pipeline steps:**

1. Checkout repository
2. Enable Corepack and activate Yarn 4
3. `yarn install` — restore dependencies from cache
4. `yarn playwright install --with-deps` — install browsers
5. `yarn test:ci` — run full suite with retries enabled
6. Upload Playwright HTML report as a workflow artifact

Test results and the HTML report are available under the **Actions** tab → select a run → **Artifacts**.

---

## Author

**Sagar Roy** — Senior SDET | Playwright + TypeScript | UI & API Automation

- LinkedIn: [linkedin.com/in/sagar-roy-3b58061b](https://www.linkedin.com/in/sagar-roy-3b58061b)
- GitHub: [github.com/sagarroy2709](https://github.com/sagarroy2709)

---

> Also see: [playwright-api-test-framework](https://github.com/sagarroy2709/playwright-api-test-framework) — companion API framework using the Endpoint Object Model pattern.
