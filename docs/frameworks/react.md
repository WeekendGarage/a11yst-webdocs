---
title: React projects
description: React detection, route discovery, and audit configuration.
---

# React projects

a11yst audits React applications in the browser and maps findings using the React source adapter when evidence allows.

## Support status

First-class integration for React Router static path discovery from source.

## Detection

`a11yst detect` identifies React from dependencies and project layout. Confirm with:

```bash
a11yst detect --json
```

## Dev server

The adapter recommends start commands from `package.json` scripts (for example `dev`, `start`). Configure explicitly when needed:

```typescript
devServer: {
  command: "pnpm dev",
  url: "http://127.0.0.1:5173",
  reuseExisting: true,
  startupTimeout: 60_000,
},
```

## Route discovery

When `routes` is empty, a11yst scans source for React Router static paths. See [Route discovery and planning](../core-concepts/route-discovery-and-planning.md#react-route-discovery) for supported patterns, dynamic routes, fallback rules, and test fixtures.

| Outcome | Behavior |
| --- | --- |
| Paths found | Audits discovered routes |
| No paths found | Falls back to `/` with diagnostic `REACT_ROUTES_EXPLICIT_RECOMMENDED` |

Inspect discovery:

```bash
a11yst routes --explain
```

### Explicit routes

Recommended for Vite SPAs without filesystem-friendly router definitions:

```typescript
routes: ["/", "/settings", "/checkout"],
routeDiscovery: { mode: "off" },
```

## SPA considerations

a11yst captures rendered DOM in Chromium. It does not instrument React internals. Dynamic routes, auth gates, and data-dependent UI may require:

- explicit routes
- [flows](../core-concepts/index.md) with checkpoints
- `readiness` selectors or `settleFrames`

## Source mapping

Findings may include **likely source** locations in `.jsx`/`.tsx` files when the source index and mapper resolve candidates. Wording is probabilistic — see [Source mapping](../source-intelligence/source-mapping.md).

## Limitations

| Limitation | Detail |
| --- | --- |
| Dynamic route params | May appear as skipped patterns; add `samples` or explicit paths |
| Code splitting | Unvisited routes are not audited unless configured |
| Non–React Router routing | May require explicit `routes` |

## Example

See `examples/` React fixtures in the a11yst repository for validated configurations.
