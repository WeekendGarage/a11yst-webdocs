---
title: Getting started
description: Install a11yst, run your first audit, and understand structured results.
---


a11yst is a local CLI for web accessibility testing. It audits real pages in a browser, applies a11yst-owned profile checks, and writes structured artifacts for review and CI.

Automated checks do not establish accessibility conformance. Manual accessibility review remains necessary.

## Installation

When `@a11yst/cli` is published:

```bash
pnpm add -D @a11yst/cli
pnpm exec playwright install chromium
```

Until then, install from a local or workspace build. Chromium is managed by Playwright; a11yst does not download browsers during package installation.

## Quick start

```bash
a11yst init
a11yst detect
a11yst audit
```

Start with a small route set and the default profile. The URL in `a11yst.config.ts` (`devServer` or `baseUrl`) must match a running app or preview.

Findings use severity labels **MINOR**, **MEDIUM**, **HIGH**, and **CRITICAL** (never color alone). Use JSON for automation and HTML or Markdown for review.

## Next

- [Route discovery and planning](../core-concepts/route-discovery-and-planning.md)
- [Regression testing](../regression-testing/index.md)
- [Reports](../reports/index.md)
- [Frameworks](../frameworks/index.md)
