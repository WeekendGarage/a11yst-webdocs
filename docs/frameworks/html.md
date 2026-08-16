---
title: HTML projects
description: Static HTML and generic web projects in a11yst.
---

# HTML projects

Use the HTML adapter for static sites, documentation sites, and other projects served as HTML without a SPA framework.

## Support status

First-class integration for filesystem HTML discovery and static source mapping.

## Detection

`a11yst detect` sets `framework: "html"` when no SPA framework is detected.

## Route discovery

The adapter walks the project for `.html` files and maps them to URL paths. Use `routeDiscovery` to control behavior:

```typescript
import { defineConfig } from "@a11yst/config";

export default defineConfig({
  projects: [
    {
      name: "docs",
      platform: "web",
      framework: "html",
      baseUrl: "http://127.0.0.1:8000",
      devServer: {
        command: "mkdocs serve --dev-addr 127.0.0.1:8000",
        url: "http://127.0.0.1:8000",
        reuseExisting: true,
      },
      routes: ["/", "/getting-started/"],
      routeDiscovery: { mode: "off" },
    },
  ],
});
```

For MkDocs and similar generators, **explicit routes** are often clearer than filesystem discovery of source files.

## Server requirement

a11yst audits rendered pages in Chromium. Provide:

- a running dev or preview server (`devServer.command`), or
- a deployed preview URL in `baseUrl` with `--no-start-server`

## Limitations

| Limitation | Detail |
| --- | --- |
| Source files vs served URLs | Discovery scans project files, not your generator output tree |
| Dynamic content | Client-rendered behavior requires running the built site |
| No filesystem crawl of remote sites | You must configure reachable URLs |

## Troubleshooting

```bash
a11yst routes --explain --project docs
```

See [Troubleshooting — routes](../troubleshooting/index.md#routes).
