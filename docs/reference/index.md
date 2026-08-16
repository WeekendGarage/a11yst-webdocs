---
title: Reference overview
description: CLI, configuration, environment variables, exit codes, and result model.
---

# Reference overview

Guides explain workflows; reference pages document exact behavior from the current a11yst implementation.

| Page | Contents |
| --- | --- |
| [CLI](cli.md) | Commands, flags, global options |
| [Configuration](configuration.md) | `a11yst.config.*` schema |
| [Environment variables](environment-variables.md) | Terminal and CI variables |
| [Exit codes](exit-codes.md) | Process exit semantics |
| [Result model](result-model.md) | Audit JSON structure |

Authoritative runtime help:

```bash
a11yst --help
a11yst audit --help
```

Product version: **0.1.0** (pre-release). Field names may evolve before 1.0; verify against your installed build.

## Precedence (summary)

| Layer | Wins over |
| --- | --- |
| CLI flags | Config file defaults |
| `--config` path | Walk-up discovery |
| `baseUrl` | `devServer.url` when both set (must be consistent) |

Full detail: [Configuration — precedence](configuration.md#precedence).
