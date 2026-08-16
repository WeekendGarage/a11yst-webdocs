---
title: Baselines
description: Baseline file location, schema, fingerprints, and comparison behavior.
---

# Baselines

A baseline stores stable **fingerprints** of findings from a reference audit. Later audits compare against those entries to produce lifecycle classifications.

## Default storage

| Setting | Default |
| --- | --- |
| Config key | `baseline.file` |
| Default path | `.a11yst/baseline.json` (relative to the directory containing `a11yst.config.*`) |
| Override | `--baseline <path>` on `a11yst audit`, or `baseline.file` in config |

The baseline file is JSON with `schemaVersion: "1"` and `fingerprintVersion: "1"`. Do not edit fingerprint algorithms or versions manually; use `a11yst baseline migrate` when schema migrations are required.

## Creating a baseline

After a successful audit:

```bash
a11yst audit --create-baseline
```

Or from persisted results:

```bash
a11yst baseline create --from .a11yst/results/latest.json
```

Use `--force` to overwrite an existing file when you intentionally replace the reference set.

!!! warning "Review before replacing"
    Replacing a baseline without reviewing diffs hides regressions in future comparisons. Prefer `a11yst baseline update --dry-run` first.

## Comparison behavior

When `baseline.compare` is `true` (default), each audit:

1. Loads the baseline file (if present).
2. Matches findings by **fingerprint** and location context.
3. Assigns lifecycle status: [new](classifications.md#new), [known](classifications.md#known), [regressed](classifications.md#regressed), or [resolved](classifications.md#resolved).
4. Writes comparison metadata into JSON output (`baselineSummary`, per-finding `baseline` fields).

Disable comparison for a single run:

```bash
a11yst audit --no-baseline
```

## Fingerprints

Fingerprints identify a finding across runs. They are derived from rule, project, route or flow context, profile, viewport, and target identity — not from severity text alone.

| Concept | Detail |
| --- | --- |
| Purpose | Stable matching for baseline comparison |
| Version | `fingerprintVersion: "1"` in baseline and findings |
| Stability | Stable for a given product version and schema; not guaranteed across arbitrary future schema changes |

You do not need to compute fingerprints yourself. a11yst assigns them during audits.

## Baseline is not acceptance

Storing a finding in the baseline means “this fingerprint was seen in the reference audit.” It does **not** mean:

- the finding is acceptable for users
- WCAG conformance is established
- manual review is complete

Use [classifications](classifications.md) and team process for disposition; use the baseline for **change detection**.

## Configuration

```typescript
export default defineConfig({
  baseline: {
    file: ".a11yst/baseline.json",
    compare: true,
    classifications: true,
  },
});
```

See [Configuration reference](../reference/configuration.md#baseline) for all baseline fields.

## Related commands

| Command | Purpose |
| --- | --- |
| `a11yst baseline status` | Show baseline file state and latest comparison summary |
| `a11yst baseline update` | Merge audit results into the baseline |
| `a11yst baseline migrate` | Migrate baseline schema version |
