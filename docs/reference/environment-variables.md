---
title: Environment variables
description: Environment variables used by a11yst and terminal output.
---

# Environment variables

## A11YST_ prefix

There are **no public `A11YST_*` environment variables** defined in `@a11yst/cli` or `@a11yst/config`.

Do not document fictional `A11YST_OUTPUT`, `A11YST_BASE_URL`, or similar unless added in a future release.

Your config file may **read** `process.env.MY_APP_URL` (or any name you choose) when the config module loads — that is application-specific, not built into a11yst.

Internal/test-only variables (for example demo generation) exist in the repository but are not part of the public CLI contract.

## Terminal and CI variables

| Variable | Purpose | Default / notes |
| --- | --- | --- |
| `NO_COLOR` | Disable ANSI color when set (any value) | Unset = no effect |
| `FORCE_COLOR` | `"0"` disables color; other values may force enable in Node conventions | Optional |
| `CI` | When set, suppresses animated progress in `auto` mode | Common on GitHub Actions |
| `TERM` | `"dumb"` disables color and animation | Remote shells |
| `GITHUB_STEP_SUMMARY` | File path GitHub Actions sets for step summaries | Required for `--github-step-summary` append |

## Precedence with CLI

| Behavior | Order |
| --- | --- |
| Color | `--json` → `--color never` → `NO_COLOR` → `--color always` → `--color auto` |
| Progress | `--json` / `--no-progress` → `--progress` mode |

See [CLI — color](cli.md#color-behavior).

## Secrets

Do not commit tokens in config. Reference env vars you define:

```typescript
baseUrl: process.env.PREVIEW_URL ?? "http://127.0.0.1:3000",
```

a11yst does not redact custom env var names in logs; avoid logging secrets in `devServer.command`.

## Related

- [Configuration](configuration.md)
- [CI](../ci/index.md)
