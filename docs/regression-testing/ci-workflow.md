---
title: CI workflow for regression testing
description: Recommended CI steps for baselines, comparison, and policy gates.
---

# CI workflow for regression testing

Use this after [baselines](baselines.md) and [policies](policies.md). A full GitHub Actions example lives on the [CI](../ci/index.md) page.

## Recommended steps

1. **Checkout** including `.a11yst/baseline.json` if you track it.
2. **Install** Node.js, app dependencies, and Playwright Chromium.
3. **Build or start** the app so `baseUrl` responds.
4. **Run** `a11yst audit` with JSON and reports.
5. **Read** the exit code (**2** is a policy breach, **1** is operational).
6. **Upload** `.a11yst/results/` for review.

## Baseline in CI

| Practice | Detail |
| --- | --- |
| Store baseline in git | Same comparison reference on every branch |
| Do not auto-update in CI | Update locally after review, then commit |
| Use `--dry-run` locally | Preview baseline changes before `--yes` |

Creating a baseline on every CI run defeats regression detection.

## Related

- [Updating a baseline](updating-baseline.md)
- [CI](../ci/index.md)
- [Troubleshooting](../troubleshooting/index.md)
