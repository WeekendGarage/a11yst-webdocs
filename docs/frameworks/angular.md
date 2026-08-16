---
title: Angular projects
description: Angular detection, configuration, and route limitations.
---

# Angular projects

a11yst audits Angular applications in Chromium with the Angular adapter for readiness hints and source mapping.

## Support status

First-class browser auditing and Angular source mapping. **Automatic route discovery is not available** — configure routes explicitly.

## Detection

`framework: "angular"` when Angular dependencies and `angular.json` are present.

## Route discovery

Without configured `routes`, the adapter:

1. Reads `angular.json` for diagnostics (source root, project name)
2. Emits guidance to configure routes explicitly
3. Falls back to `/`

Example:

```typescript
import { defineConfig } from "@a11yst/config";

export default defineConfig({
  projects: [
    {
      name: "web",
      platform: "web",
      framework: "angular",
      baseUrl: "http://127.0.0.1:4200",
      devServer: {
        command: "ng serve",
        url: "http://127.0.0.1:4200",
      },
      routes: ["/", "/dashboard", "/settings"],
      routeDiscovery: { mode: "off" },
    },
  ],
});
```

## Dev server

Typically `ng serve` on port 4200. Override when using custom builders or monorepo layouts.

## Limitations

| Limitation | Detail |
| --- | --- |
| Lazy-loaded modules | Routes not in config are not visited |
| Library projects | Point `rootDir` at the application project |
| Workspace variants | Verify `rootDir` and `baseUrl` per app |

## Source mapping

Component `.ts` / template locations may appear as **likely source** when mappers resolve template URLs and selectors.

See [Source mapping](../source-intelligence/source-mapping.md).
