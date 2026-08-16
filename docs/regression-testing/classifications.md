---
title: Classifications
description: Lifecycle statuses, regression reasons, and finding dispositions.
---

# Classifications

a11yst uses two related concepts:

| Concept | Meaning |
| --- | --- |
| **Lifecycle status** | How a finding relates to the baseline comparison (`new`, `known`, `regressed`, `resolved`) |
| **Disposition** | Optional team classification stored in the baseline (`false-positive`, `accepted-risk`, …) |

Lifecycle status comes from comparison. Disposition comes from `a11yst classify` and affects CI policy filtering.

## Lifecycle statuses

### New

The finding’s fingerprint is **not** in the baseline.

First time you see this issue in the comparison reference.

### Known

The finding matches a baseline entry and **no regression** was detected.

The issue still exists in the application; it is unchanged relative to the baseline snapshot.

### Regressed

The finding matches a baseline entry but a **regression** was detected. Common reasons:

| Reason | Meaning |
| --- | --- |
| `returned-after-resolution` | Was resolved relative to baseline but appeared again |
| `classification-expired` | An accepted classification expired |
| `severity-increased` | Severity rose (for example HIGH → CRITICAL) |
| `confidence-increased` | Confidence rose for a11yst-owned findings |
| `scope-expanded` | Scope expanded relative to baseline |

### Resolved

The fingerprint exists in the baseline but is **absent** from the current audit (within comparable coverage).

Useful for confirming fixes without re-triaging every historical issue.

## Example

**Baseline (RUN 1)**

| Severity | Rule | Status in baseline |
| --- | --- | --- |
| HIGH | link-name | stored |
| MEDIUM | color-contrast | stored |

**After code change (RUN 2)**

| Finding | Lifecycle |
| --- | --- |
| link-name (still present) | **known** |
| color-contrast (fixed) | **resolved** |
| select-name (first appearance) | **new** |
| link-name (severity increased) | **regressed** |

Terminal and JSON output use these exact status labels.

## Dispositions

Assign a disposition when your team needs to record why a known finding is handled differently in CI:

```bash
a11yst classify <finding-id> \
  --disposition false-positive \
  --reason "Decorative icon hidden from assistive tech" \
  --yes
```

| Disposition | CI policy impact |
| --- | --- |
| `false-positive` | Excluded from policy breaches |
| `not-applicable` | Excluded from policy breaches |
| `accepted-risk` | May still breach policy if severity meets threshold |
| `third-party` | May still breach policy |
| `manual-review` | May still breach policy |

Remove a disposition:

```bash
a11yst unclassify <finding-id> --yes
```

## Filtering findings

```bash
a11yst findings --status new --status regressed
a11yst findings --disposition accepted-risk
```

## Policy interaction

CI policies evaluate **new** and **regressed** findings that meet the configured `--minimum-severity`. Dispositions `false-positive` and `not-applicable` are never policy breaches.

See [Policies](policies.md) and [Exit codes](../reference/exit-codes.md).
