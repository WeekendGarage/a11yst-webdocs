---
title: Regression testing overview
description: Compare audits over time with baselines, lifecycle classifications, and CI policies.
---

# Regression testing overview

Regression testing compares a new audit against a stored **baseline**. Each finding is **new**, **known**, **regressed**, or **resolved**.

!!! note "Baseline is not approval"
    A finding in the baseline is **not** marked acceptable or compliant. It is only a comparison reference. Use [classifications](classifications.md) for disposition.

Typical loop: audit and review → [create or update a baseline](updating-baseline.md) → change the app → audit again → triage new/regressed findings → optionally fail CI with [policies](policies.md).

- [Baselines](baselines.md) — storage, fingerprints, comparison
- [Classifications](classifications.md) — lifecycle and dispositions
- [Updating a baseline](updating-baseline.md) — when to refresh the file
- [Policies](policies.md) — CI gates
- [CI workflow](ci-workflow.md) — pipeline practices
