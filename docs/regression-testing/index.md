---
title: Regression testing overview
description: Compare audits over time with baselines, lifecycle classifications, and CI policies.
---

# Regression testing overview

Regression testing in a11yst means comparing a new audit against a stored **baseline**. The baseline records fingerprints of findings you have seen before; the next run classifies each finding as **new**, **known**, **regressed**, or **resolved**.

This section documents operational workflows. For the mental model (projects, routes, profiles, and findings), see [Core concepts](../core-concepts/index.md).

!!! note "Baseline is not approval"
    A finding present in the baseline is **not** marked as acceptable, compliant, or safe. The baseline is a comparison reference only. Use [classifications](classifications.md) when you need to record disposition separately from lifecycle status.

## What you get

| Output | Purpose |
| --- | --- |
| Lifecycle status per finding | See what changed since the last stored baseline |
| `baselineSummary` in JSON | Counts of new, known, regressed, and resolved findings |
| CI policy evaluation | Optional pass/fail gates on new or regressed findings |
| Baseline file | Versioned JSON at `.a11yst/baseline.json` by default |

## Typical workflow

1. Run an audit and review findings.
2. Create or update a baseline when the current set is your comparison reference — see [Updating a baseline](updating-baseline.md).
3. Change application code.
4. Run the next audit; a11yst compares against the baseline automatically when `baseline.compare` is enabled.
5. Triage **new** and **regressed** findings; confirm **resolved** findings.
6. In CI, enable [policies](policies.md) so unexpected changes fail the job — see [CI workflow](ci-workflow.md).

## Commands

| Task | Command |
| --- | --- |
| Audit with comparison | `a11yst audit` |
| Create baseline from results | `a11yst baseline create --from .a11yst/results/latest.json` |
| Preview baseline update | `a11yst baseline update --from … --dry-run` |
| Apply baseline update | `a11yst baseline update --from … --yes` |
| Baseline status | `a11yst baseline status` |
| Filter findings by status | `a11yst findings --status new --status regressed` |

## Next steps

- [Baselines](baselines.md) — storage, fingerprints, and comparison mechanics
- [Classifications](classifications.md) — lifecycle statuses and dispositions
- [Updating a baseline](updating-baseline.md) — when and how to refresh the baseline file
- [Policies](policies.md) — CI gates and severity thresholds
- [CI workflow](ci-workflow.md) — recommended pipeline steps
