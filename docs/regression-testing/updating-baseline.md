---
title: Updating a baseline
description: When and how to refresh the baseline file after reviewing audit results.
---

# Updating a baseline

Update the baseline when the current audit represents the comparison reference your team wants for future runs.

## When to update

| Situation | Suggested action |
| --- | --- |
| Intentional fixes merged | Run audit; confirm **resolved** findings; update baseline to drop fixed fingerprints |
| New known issues triaged | Update baseline to include newly accepted reference fingerprints |
| Route or profile scope expanded | Review coverage; update baseline after confirming new scope is intentional |
| First-time adoption | Create baseline after initial audit review |

Avoid updating the baseline solely to make CI green without reviewing findings.

## Preview changes

Always preview before applying:

```bash
a11yst baseline update --from .a11yst/results/latest.json --dry-run
```

The preview shows entries that would be added, updated, or removed.

## Apply an update

```bash
a11yst baseline update --from .a11yst/results/latest.json --yes
```

Optional flags:

| Flag | Effect |
| --- | --- |
| `--accept-new` | Accept new findings into the baseline |
| `--remove-resolved` | Remove entries no longer present in the audit |

## Create or replace

Create from the latest audit in one step:

```bash
a11yst audit --create-baseline
```

Replace an existing file (destructive):

```bash
a11yst audit --create-baseline --force
```

Or:

```bash
a11yst baseline create --from .a11yst/results/latest.json --force
```

## Pending confirmation exit code

`baseline update`, `classify`, and `unclassify` emit a preview when `--yes` is omitted. The process exits with code **2** until you confirm with `--yes`. See [Exit codes](../reference/exit-codes.md).

## Workflow checklist

1. Run `a11yst audit` and review HTML or Markdown reports.
2. Triage **new** and **regressed** findings.
3. Run `a11yst baseline update --dry-run`.
4. Share the diff with your team if needed.
5. Apply with `--yes`.
6. Commit `.a11yst/baseline.json` to version control when your team tracks baselines in git.
