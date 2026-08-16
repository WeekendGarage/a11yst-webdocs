---
title: Next.js projects
description: Next.js App Router and Pages Router support in a11yst.
---

# Next.js projects

The Next.js adapter discovers routes from the filesystem for both App Router and Pages Router layouts.

## Support status

First-class integration with filesystem discovery and Next-specific source mapping.

## Detection

Requires `next` dependency. Run `a11yst detect --json` to confirm `framework: "next"`.

## Route discovery

Scans project files for:

- **App Router** — `app/**/page.{tsx,jsx,js}`
- **Pages Router** — `pages/**/*.{tsx,jsx,js}`

| Diagnostic | Meaning |
| --- | --- |
| `NEXT_ROUTE_COLLISION` | Same path from App and Pages routers |
| `NEXT_HYBRID_ROUTER` | Both routers present |

Use explicit `routes` when collisions or hybrid setups need manual control.

### Dynamic segments

Dynamic routes (for example `[slug]`) appear as patterns. Provide samples in config:

```typescript
routeDiscovery: {
  mode: "merge",
  samples: {
    "/blog/[slug]": ["/blog/hello", "/blog/world"],
  },
},
```

## Dev server

Recommended from `package.json`:

```typescript
devServer: {
  command: "pnpm dev",
  url: "http://127.0.0.1:3000",
},
```

## Limitations

| Area | Current behavior |
| --- | --- |
| App Router vs Pages Router | Both scanned; collisions reported |
| Server Components | Audited as rendered in browser context |
| Middleware-only routes | May require explicit routes |
| Route groups `(group)` | Discovered with group segments omitted per Next conventions |

Verify coverage with:

```bash
a11yst routes --explain --project web
```

## Source mapping

Next.js mapper uses framework compiler metadata when available. Locations are **likely source**, not guaranteed exact lines in all build modes.

See [Source intelligence](../source-intelligence/index.md).
