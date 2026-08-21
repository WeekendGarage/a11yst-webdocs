---
title: CI
description: Continuous integration overview, exit behavior, policies, GitHub Actions, and artifacts.
---

# CI

a11yst runs the same locally and in CI: configure projects, reach a target URL, audit, write artifacts, exit with a status code.

## Installing a11yst

When `@a11yst/cli` is published to npm:

```bash
pnpm add -D @a11yst/cli
pnpm exec playwright install chromium
```

During pre-release development, install from a workspace build or private registry. **Do not** use a global npm install as the current production path until the package is publicly available.

## Pipeline

```text
checkout → install deps → install Chromium → build/start app → a11yst audit → upload artifacts
```

The target URL must match `baseUrl` or `devServer.url`. Use `--json` for automation. Commit `.a11yst/baseline.json` if you compare against a baseline in CI.

Exit codes: **0** success, **1** operational/config error, **2** policy failure. Details: [Exit codes](../reference/exit-codes.md). Policy flags: [Policies](../regression-testing/policies.md). Artifacts: [Reports](../reports/index.md).

## GitHub Actions

```yaml
name: Accessibility

on:
  push:
    branches: [main]
  pull_request:

jobs:
  a11yst:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm exec playwright install chromium

      - name: Build application
        run: pnpm build

      - name: Run a11yst
        run: |
          pnpm exec a11yst audit \
            --json \
            --fail-on-new \
            --minimum-severity high
        env:
          CI: true

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: a11yst-results
          path: .a11yst/results/
```

Adapt build, server, and config to your app. a11yst **generates** SARIF when enabled; uploading it to GitHub Code Scanning is a separate step.

`--github-step-summary` appends Markdown when `GITHUB_STEP_SUMMARY` is set. `--github-annotations` writes annotation commands into the results bundle.

## Related

- [Regression CI workflow](../regression-testing/ci-workflow.md)
- [Reports](../reports/index.md)
- [Configuration](../reference/configuration.md)
