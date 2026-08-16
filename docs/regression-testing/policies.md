---
title: Policies
description: CI policy configuration, evaluation rules, and exit behavior.
---

# Policies

A **finding** is an accessibility analysis result. A **policy** decides whether those results should fail a command or CI job.

Policies do not change finding severity or rewrite audit output. They filter which findings breach CI gates.

## Enable policy evaluation

Policy evaluation runs when **any** fail-on flag is true:

```typescript
export default defineConfig({
  ci: {
    failOnNew: true,
    failOnRegression: true,
    failOnExpiredClassification: false,
    minimumSeverity: "high",
  },
});
```

CLI overrides (take precedence over config):

```bash
a11yst audit \
  --fail-on-new \
  --fail-on-regression \
  --minimum-severity high
```

| Config / CLI key | Default | Meaning |
| --- | --- | --- |
| `failOnNew` / `--fail-on-new` | `false` | Fail when new findings meet severity threshold |
| `failOnRegression` / `--fail-on-regression` | `false` | Fail when regressed findings meet threshold |
| `failOnExpiredClassification` / `--fail-on-expired-classification` | `false` | Fail when an accepted classification expired |
| `minimumSeverity` / `--minimum-severity` | `high` | Lowest severity that can breach (`minor`, `medium`, `high`, `critical`) |

## Requirements

| Requirement | Detail |
| --- | --- |
| Baseline file | Policy evaluation requires baseline comparison. Without a baseline, status is `not-evaluated` and exit code is **1**. |
| Completed audit | Policy runs only after a successful audit completion |

## What breaches policy

Only findings with lifecycle **new** or **regressed** are candidates.

Dispositions excluded from breaches:

- `false-positive`
- `not-applicable`

Dispositions that **can** still breach: `accepted-risk`, `third-party`, `manual-review`.

Breach kinds: `new-finding`, `regressed-finding`, `expired-classification`.

## Exit codes

| Outcome | Exit code |
| --- | --- |
| Audit completed; policy disabled or passed | **0** |
| Operational error, incomplete audit, or policy not evaluable | **1** |
| Audit completed; policy failed | **2** |

See [Exit codes](../reference/exit-codes.md).

## Example: fail on new HIGH+ findings

```typescript
import { defineConfig } from "@a11yst/config";

export default defineConfig({
  ci: {
    failOnNew: true,
    failOnRegression: false,
    minimumSeverity: "high",
  },
  projects: [
    {
      name: "app",
      platform: "web",
      framework: "react",
      baseUrl: "http://127.0.0.1:5173",
      devServer: {
        command: "pnpm dev",
        url: "http://127.0.0.1:5173",
      },
    },
  ],
});
```

This example validates against the current `@a11yst/config` schema.

## Policy vs finding severity

Policy uses a11yst public severity labels (**MINOR**, **MEDIUM**, **HIGH**, **CRITICAL**). It does not use provider-specific impact names in human-facing output.

JSON results may include technical provenance fields (for example `sourceImpact`) for automation; terminal and Markdown reports remain provider-neutral.

## Related

- [Classifications](classifications.md)
- [CI overview](../ci/index.md)
- [Configuration reference — ci](../reference/configuration.md#ci)
