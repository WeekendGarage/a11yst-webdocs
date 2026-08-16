---
title: CI
description: Continuous integration overview, exit behavior, policies, GitHub Actions, and artifacts.
---

# CI

a11yst runs locally and in CI the same way: configure projects, start or reuse a dev server, audit routes and flows, write artifacts, and exit with a status code.

## Installing a11yst

When `@a11yst/cli` is published to npm:

```bash
pnpm add -D @a11yst/cli
pnpm exec playwright install chromium
```

During pre-release development, install from this repository (workspace build) or your private registry. **Do not** use a global npm install as the current production path until the package is publicly available.

Chromium is installed via Playwright; a11yst does not download browsers during `npm install`.

## CI overview

```text
checkout → install deps → install Chromium → build/start app → a11yst audit → upload artifacts
```

| Step | Detail |
| --- | --- |
| Target URL | Must match `baseUrl` or `devServer.url` in config — a11yst does not scan arbitrary ports |
| Machine output | Use `--json` on stdout for automation; disable color with `--color never` or `NO_COLOR` |
| Progress | Disabled automatically with `--json`; override with `--progress never` |
| Baseline | Commit `.a11yst/baseline.json` when using regression comparison in CI |

## Exit behavior

| Code | When |
| --- | --- |
| **0** | Command succeeded; audit completed and CI policy disabled or passed |
| **1** | Operational or configuration error; audit incomplete; policy not evaluable (no baseline) |
| **2** | Audit completed but CI policy failed; or pending confirmation for baseline/classify commands |

See [Exit codes](../reference/exit-codes.md).

## Policies

Configure in `a11yst.config.*` or override on the CLI:

```bash
a11yst audit --fail-on-new --fail-on-regression --minimum-severity high
```

Policy requires baseline comparison. See [Policies](../regression-testing/policies.md).

## GitHub Actions

Valid workflow example (YAML syntax checked in repository tests):

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

Adapt `build`, dev server, and config to your project. a11yst **generates** SARIF when enabled; **uploading** SARIF to GitHub Code Scanning is a separate CI step your team must add.

### GitHub step summary

When `reports.githubStepSummary` is enabled (or `--github-step-summary`), a11yst appends Markdown to the path in `GITHUB_STEP_SUMMARY` if that variable is set by GitHub Actions.

### GitHub annotations

`--github-annotations` writes workflow annotation commands into the audit bundle. Emit them in a subsequent step if your workflow consumes that file.

## Artifacts

Default output directory: `.a11yst/results/` (override with `outputDir` or `--output`).

| Artifact | Default | Flag / config |
| --- | --- | --- |
| JSON results | yes | `--json` (stdout) + bundle `results.json` |
| HTML report | yes | `reports.html`; disable with `--no-html` |
| Markdown report | yes | `reports.markdown`; disable with `--no-markdown` |
| SARIF 2.1.0 | off | `--sarif` or `reports.sarif.enabled` |
| JUnit XML | off | `--junit` or `reports.junit.enabled` |
| Evidence | on | `evidence.screenshots`; disable with `--no-screenshots` |
| GitHub annotations file | off | `--github-annotations` |

Upload the entire `.a11yst/results/` directory or selected files as CI artifacts.

## SARIF in CI

a11yst emits SARIF when configured. Your platform must ingest the file (for example GitHub `upload-sarif` action). a11yst does not automatically upload to Code Scanning.

## JUnit in CI

JUnit output is intended for test report consumers (Buildkite, Jenkins, GitLab, etc.). It is not the primary human-readable report — use HTML or Markdown for review.

## Related

- [Regression CI workflow](../regression-testing/ci-workflow.md)
- [Reports](../reports/index.md)
- [Configuration](../reference/configuration.md)
