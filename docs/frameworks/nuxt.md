---
title: Nuxt projects
description: Nuxt route discovery and audit configuration.
---

# Nuxt projects

The Nuxt adapter discovers routes from the `pages/` directory and supports Nuxt-specific source mapping.

## Support status

First-class integration for `pages/` filesystem discovery.

## Detection

`framework: "nuxt"` when Nuxt dependencies are detected.

## Route discovery

Scans `pages/` for route files similar to Nuxt conventions. When no pages are found, falls back to `/` with a diagnostic.

Dynamic segments may require `routeDiscovery.samples`:

```typescript
routeDiscovery: {
  mode: "fallback",
  samples: {
    "/posts/[id]": ["/posts/1", "/posts/example"],
  },
},
```

Verify:

```bash
a11yst routes --explain
```

## Dev server

```typescript
devServer: {
  command: "pnpm dev",
  url: "http://127.0.0.1:3000",
},
```

Nuxt 3 default port may differ — align `url` with your project.

## Limitations

| Limitation | Detail |
| --- | --- |
| App config routes | Not all Nuxt routing features are inferred from files alone |
| Server routes | Audited only when reachable in browser at configured URLs |
| Hybrid with Vue guide | Use this Nuxt guide, not the [Vue](vue.md) guide |

## Source mapping

Nuxt mapper resolves `.vue` and framework paths when build artifacts and indexes allow.
