---
title: Exit codes
description: a11yst process exit code reference.
---

# Exit codes

a11yst uses three exit codes for the CLI process.

| Code | Meaning |
| --- | --- |
| **0** | Success |
| **1** | Operational or configuration failure; audit incomplete; policy not evaluable |
| **2** | Policy failure after completed audit; or pending user confirmation |

Implementation: `getAuditExitCode` in `@a11yst/policy`.

## audit

| Situation | Code |
| --- | --- |
| Audit completed; no CI policy evaluation | **0** |
| Audit completed; CI policy passed | **0** |
| Config error, browser failure, timeout, persistence error | **1** |
| Audit did not complete | **1** |
| CI policy enabled but baseline missing → `not-evaluated` | **1** |
| Audit completed; CI policy failed (new/regressed/expired breach) | **2** |

## doctor

| Status | Code |
| --- | --- |
| `ok` or `warn` | **0** |
| `fail` | **1** |

## baseline update, classify, unclassify

| Situation | Code |
| --- | --- |
| Preview emitted; `--yes` not passed | **2** |
| Applied successfully | **0** |
| Error | **1** |

## Other commands

Most commands (`detect`, `init`, `routes`, `findings`, `report`, …) exit **1** on error and **0** on success.

## Examples

**Successful audit, no policy**

```bash
a11yst audit
echo $?  # 0
```

**Policy breach**

```bash
a11yst audit --fail-on-new --minimum-severity high
echo $?  # 2 when new HIGH+ findings exist
```

**Missing Chromium / bad config**

```bash
a11yst audit
echo $?  # 1
```

## Findings vs exit code

Findings alone do **not** fail the command unless CI policy flags are enabled (or future explicit fail flags). A run with findings but no policy exits **0**.

## Related

- [Policies](../regression-testing/policies.md)
- [CI](../ci/index.md)
