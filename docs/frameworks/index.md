---
title: Frameworks
description: Supported web frameworks for detection, route discovery, and audits.
---

# Frameworks

a11yst detects your web framework and uses an adapter for dev-server hints, route discovery, readiness, and source mapping.

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

Set `framework` in config when detection is ambiguous. Inspect planned URLs with `a11yst routes --explain`. Discovery modes (`off`, `fallback`, `merge`) are documented in [Route discovery and planning](../core-concepts/route-discovery-and-planning.md).
