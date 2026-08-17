---
title: Frameworks
description: Supported web frameworks for detection, route discovery, and audits.
---

# Frameworks

a11yst detects your web framework and uses a matching adapter for dev-server hints, route discovery, readiness, and source mapping.

## Support status

| Framework | Route discovery | Source mapping | Notes |
| --- | --- | --- | --- |
| [HTML](html.md) | Filesystem `.html` | Static HTML adapter | Static sites and previews |
| [React](react.md) | React Router paths from source | React adapter | Falls back to `/` with diagnostic |
| [Next.js](next.md) | App + Pages router scan | Next adapter | Dynamic segments may need `samples` |
| [Vue](vue.md) | Explicit routes recommended | Vue adapter | No filesystem discovery in this phase |
| [Nuxt](nuxt.md) | `pages/` scan | Nuxt adapter | Falls back to `/` when empty |
| [Angular](angular.md) | Explicit routes recommended | Angular adapter | Reads `angular.json` for diagnostics |

**React Native**, **Expo**, and native mobile platforms are **not** currently supported for operational audits.

## Detection

```bash
a11yst detect
a11yst detect --json
```

Set `framework` explicitly in config when detection is ambiguous.

## Route discovery modes

| Mode | Behavior |
| --- | --- |
| `off` | Only `routes` listed in config |
| `fallback` (default) | Use adapter discovery; fall back to configured routes |
| `merge` | Combine configured routes with discovered routes |

```bash
a11yst routes --explain
```

Shows discovered routes, sources, and diagnostics per project.

## Official website

The a11yst documentation site is **MkDocs + Material** with `framework: "html"`, explicit routes, and a local preview server. See `a11yst.config.ts` in this repository.

## Choose a guide

- [HTML](html.md)
- [React](react.md)
- [Next.js](next.md)
- [Vue](vue.md)
- [Nuxt](nuxt.md)
- [Angular](angular.md)

Configuration reference: [Configuration](../reference/configuration.md).
