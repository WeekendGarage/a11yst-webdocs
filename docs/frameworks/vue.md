---
title: Vue projects
description: Vue detection, configuration, and route limitations.
---

# Vue projects

a11yst audits Vue applications in Chromium and maps findings with the Vue source adapter.

## Support status

First-class browser auditing and Vue source mapping. **Filesystem route discovery is not available** in the current release — configure routes explicitly.

## Detection

`a11yst detect` sets `framework: "vue"` when Vue is present. Vue Router is not auto-detected as a separate framework id.

## Route discovery

When no `routes` are configured, the adapter:

1. Emits diagnostic `VUE_ROUTES_EXPLICIT_RECOMMENDED`
2. Falls back to auditing `/` only

Configure paths explicitly:

```typescript
import { defineConfig } from "@a11yst/config";

export default defineConfig({
  projects: [
    {
      name: "web",
      platform: "web",
      framework: "vue",
      baseUrl: "http://127.0.0.1:5173",
      devServer: {
        command: "pnpm dev",
        url: "http://127.0.0.1:5173",
      },
      routes: ["/", "/about", "/settings"],
      routeDiscovery: { mode: "off" },
    },
  ],
});
```

## Dev server

Start command is inferred from npm scripts when omitted. Match the URL Vite or Vue CLI prints at startup.

## Readiness

Vue adapter supplies a readiness strategy tuned for SPA hydration. Add `readiness.selector` when your shell loads asynchronously.

## Limitations

| Limitation | Detail |
| --- | --- |
| No auto route scan | List routes or use `routes --explain` to confirm fallback |
| Vue Router dynamic routes | Provide explicit paths or samples |
| Nuxt projects | Use the [Nuxt guide](nuxt.md) instead |

## Source mapping

Vue SFC and TS files can appear as **likely source** when the mapper resolves candidates.
