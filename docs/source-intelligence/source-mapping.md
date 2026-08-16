---
title: Source mapping
description: How a11yst maps DOM findings to repository locations.
---

# Source mapping

Source mapping connects a browser finding to **candidate** locations in your codebase.

## What it does

1. Collects finding target, DOM context, and route metadata.
2. Indexes repository sources for the project scope.
3. Invokes the framework mapper (html, react, next, vue, nuxt, angular).
4. Optionally ranks ambiguous candidates.

Output appears in terminal (when enabled), HTML/Markdown reports, and JSON (`sourceMapping`, `sourceRanking` fields).

## Probabilistic results

a11yst does **not** guarantee the exact file and line in every case.

| Factor | Effect |
| --- | --- |
| Minified bundles | Weak or missing mapping |
| Missing source maps | Mapper relies on static index and selectors |
| Dynamic rendering | DOM node may not map 1:1 to source |
| Generated code | May map to compiled output |

Preferred presentation:

```text
Likely source
src/components/SocialLinks.jsx:19
```

## Example

From the canonical dogfood fixture (sanitized paths):

| Field | Value |
| --- | --- |
| Severity | HIGH |
| Rule | link-name |
| Likely source | `src/components/SocialLinks.jsx:19` |
| Recommendation | Give the icon-only link an accessible name |

This matches real formatter output; your project paths will differ.

## Mapper support

| Framework | Mapper package |
| --- | --- |
| HTML | Static HTML / selector match |
| React | `@a11yst/source-mapping-react` |
| Next.js | Next mapper |
| Vue | Vue mapper |
| Nuxt | Nuxt mapper |
| Angular | Angular mapper |

Unsupported frameworks still produce findings; mapping fields may be empty or `unmapped`.

## JSON fields

Findings may include:

| Field | Meaning |
| --- | --- |
| `sourceMapping.status` | mapped, ambiguous, unmapped, invalid |
| `sourceMapping.candidates[]` | Ranked candidates with confidence |
| `sourceMapping.selected` | Top candidate when resolved |

See [Result model](../reference/result-model.md).

## Troubleshooting

See [Troubleshooting — source mapping](../troubleshooting/index.md#source-mapping).
