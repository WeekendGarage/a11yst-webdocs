---
title: CI workflow for regression testing
description: Recommended CI steps for baselines, comparison, and policy gates.
---

# CI workflow for regression testing

Use this workflow after you understand [baselines](baselines.md) and [policies](policies.md).

## Recommended steps

1. **Checkout** repository including `.a11yst/baseline.json` if tracked in git.
2. **Install** Node.js, project dependencies, and Playwright Chromium.
3. **Build or start** the application so the configured `baseUrl` responds.
4. **Run** `a11yst audit` with JSON and report artifacts enabled.
5. **Evaluate** exit code (policy may exit **2** on breaches).
6. **Upload** artifacts for human review (HTML, Markdown, JSON, optional SARIF/JUnit).

## Example job fragment

This example assumes `@a11yst/cli` is available as a dev dependency in your project. Until the package is published to npm, install from your registry or build from source — see [CI overview](../ci/index.md#installing-a11yst).

```yaml
- name: Install Playwright Chromium
  run: pnpm exec playwright install chromium

- name: Run a11yst audit
  run: |
    pnpm exec a11yst audit \
      --json \
      --fail-on-new \
      --fail-on-regression \
      --minimum-severity high
  env:
    CI: true

- name: Upload audit artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: a11yst-results
    path: .a11yst/results/
```

## Baseline in CI

| Practice | Detail |
| --- | --- |
| Store baseline in git | Keeps comparison reference aligned across branches |
| Do not auto-update in CI | Update baselines locally after review, then commit |
| Use `--dry-run` locally | Preview baseline changes before `--yes` |

Creating a baseline in CI on every run defeats regression detection. Create or update baselines intentionally outside the gate job, or in a separate manual workflow.

## Policy failure vs operational failure

| Exit code | Meaning | Action |
| --- | --- | --- |
| **0** | Success | Continue pipeline |
| **2** | Policy breach | Review new/regressed findings; fix or update baseline after triage |
| **1** | Operational failure | Fix config, browser, target URL, or server startup |

## Related

- [Updating a baseline](updating-baseline.md)
- [CI](../ci/index.md)
- [Troubleshooting](../troubleshooting/index.md)
