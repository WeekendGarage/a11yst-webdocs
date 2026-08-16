---
title: Result model
description: Audit JSON output structure and finding fields.
---

# Result model

`a11yst audit --json` prints an `AuditExecutionResult` document on stdout and writes `results.json` in the audit bundle.

Current `schemaVersion`: **`"1"`** (pre-release; may change before 1.0).

## Top-level fields

| Field | Description |
| --- | --- |
| `schemaVersion` | Result schema version (`"1"`) |
| `auditId` | Unique audit run id |
| `status` | Execution status |
| `summary` | Counts: runs, findings, severity breakdown, timing |
| `plan` | Planned projects, routes, profiles, flows |
| `runs[]` | Per-run outcomes |
| `findings[]` | Aggregated findings |
| `artifacts` | Paths to reports and evidence |
| `diagnostics[]` | Non-fatal messages |
| `limitations[]` | Audit scope limits |
| `baselineSummary?` | new / known / regressed / resolved counts |
| `resolvedFindings?` | Baseline entries resolved this run |
| `notComparedFindings?` | Entries not compared (coverage gaps) |
| `policyEvaluation?` | CI policy result |
| `sourceAnalysis?` | Mapping/recommendation summary |
| `reports?` | Generated report references |
| `environment` | product, version, node, browser |

Real fixture: `tests/fixtures/cli/audit-dogfood-presentation.ts` (`createAuditDogfoodFixture`).

## Finding fields (public)

| Field | Description |
| --- | --- |
| `id` | Stable id for this run |
| `fingerprint` | Baseline matching key |
| `fingerprintVersion` | `"1"` |
| `ruleId` | Rule identifier |
| `title`, `description` | Human-readable |
| `severity` | `minor`, `medium`, `high`, `critical` |
| `projectName`, `profile` | Context |
| `route`, `routeId`, `flowId`, `checkpointId` | Location context |
| `target[]` | Selector path |
| `evidence` | Screenshot, bounding box, html snippet |
| `baseline?` | Lifecycle status and regression reason |
| `sourceMapping?` | Candidate sources |
| `recommendations?` | Guidance block |
| `source` | `"axe"` or a11yst-owned |
| `sourceImpact?` | Technical provenance (automation JSON) |

Human terminal and Markdown reports use a11yst severity labels only — not provider-branded impact names.

## Classification (baseline)

When baseline comparison runs, findings include `baseline.status`:

`new` | `known` | `regressed` | `resolved`

## Policy evaluation

```json
"policyEvaluation": {
  "status": "passed" | "failed" | "not-evaluated" | "disabled",
  "breaches": [],
  "summary": {}
}
```

## Stability note

JSON is intended for tooling in this repository version. Field additions may occur in minor pre-release iterations. Pin a11yst version in CI and validate parsers against `schemaVersion`.

Internal TypeScript types in `@a11yst/types` may expose additional fields not guaranteed for external consumers.

## Related

- [Reports](../reports/index.md)
- [Classifications](../regression-testing/classifications.md)
- [Exit codes](exit-codes.md)
