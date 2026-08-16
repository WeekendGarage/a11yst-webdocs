---
title: Getting started
description: Install a11yst, run your first audit, and understand structured results.
---


This section introduces installation, a first audit, and how to read results.

## Introduction

a11yst is a local CLI for web accessibility testing. It combines browser-based checks with a11yst-owned profile rules, then writes structured artifacts you can review, compare, and feed into CI.

Automated checks do not establish accessibility conformance. Manual accessibility review remains necessary.

## Installation

Install dependencies in your project, then add a11yst as a development dependency when the package is published. During pre-release development, use a local build or workspace install from this repository.

```bash
pnpm add -D @a11yst/cli
pnpm exec playwright install chromium
```

Chromium is managed by Playwright. a11yst does not download browsers during package installation.

## Quick start

Initialize configuration, detect your project, and run an audit:

```bash
a11yst init
a11yst detect
a11yst audit
```

Review terminal output and artifacts under your configured output directory.

## Your first audit

Start with a small route set and the default profile. Confirm the dev server or deployed preview URL in `a11yst.config.ts` matches where your application is reachable.

## Understanding results

Findings include severity labels **MINOR**, **MEDIUM**, **HIGH**, and **CRITICAL**. Severity meaning is never conveyed by color alone—the label is always present in terminal and report output.

Use JSON output for automation and HTML or Markdown for human review.

## Next sections

- [Route discovery and planning](../core-concepts/route-discovery-and-planning.md) — explicit routes, discovery modes, and `a11yst routes --explain`
- [Regression testing](../regression-testing/index.md) — baselines and CI comparison
- [Reports](../reports/index.md) — HTML and Markdown output
- [Frameworks](../frameworks/index.md) — per-framework detection and discovery
