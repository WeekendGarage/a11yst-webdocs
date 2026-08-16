---
title: Source intelligence overview
description: Source mapping and recommendations in a11yst.
---

# Source intelligence overview

After browser analysis, a11yst can enrich findings with:

| Capability | Purpose |
| --- | --- |
| **Source mapping** | Rank candidate locations in your repository |
| **Recommendations** | Suggest remediation guidance aligned with rules and framework context |

Both are **best-effort**. They help developers act on findings; they do not modify code automatically.

## Pipeline

```text
Browser finding (rule, target, evidence)
        ↓
Repository source index + framework catalog
        ↓
Framework mapper (html, react, next, vue, nuxt, angular)
        ↓
Optional ranking when multiple candidates match
        ↓
Optional recommendation recipes
```

## Configuration

```typescript
sourceAnalysis: {
  enabled: true,      // default true
  ranking: true,      // default true
  recommendations: true, // default true
},
```

Disable when you only need raw findings:

```typescript
sourceAnalysis: { enabled: false },
```

## Public wording

Human-facing output uses:

- **likely source** / **probable source** — not “exact line guaranteed”
- a11yst severity labels — not provider-specific impact names

JSON may include technical provenance (for example `sourceImpact`) for automation consumers.

## Sections

- [Source mapping](source-mapping.md)
- [Recommendations](recommendations.md)
- [Limitations](limitations.md)

## Related

- [Core concepts — findings](../core-concepts/index.md)
- [Configuration — sourceAnalysis](../reference/configuration.md#sourceanalysis)
