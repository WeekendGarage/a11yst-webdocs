---
title: Troubleshooting
description: Common a11yst setup, target, route, and CI problems.
---

# Troubleshooting

## Browser {#browser}

**Symptom:** Chromium not found or launch fails.

**Fix:** Install Playwright browser binaries for your project:

```bash
pnpm exec playwright install chromium
```

Run `a11yst doctor` to verify environment readiness.

a11yst does not download browsers during package install.

## Target URL and port {#target}

**Symptom:** Navigation timeout or connection refused.

| Check | Action |
| --- | --- |
| Config URL | `baseUrl` or `devServer.url` must match the running server |
| Port | a11yst does not scan alternate ports if your app moved |
| Server start | Ensure `devServer.command` works locally first |
| Reuse | With `reuseExisting: true`, start the server before audit or let a11yst start it |

**Symptom:** Wrong application audited.

Verify origin with `a11yst detect` and your config file. Use `--no-start-server` only when the correct server is already listening.

## Routes {#routes}

**Symptom:** Too few routes audited.

```bash
a11yst routes --explain
```

| Cause | Fix |
| --- | --- |
| Discovery gap | Add explicit `routes` |
| Dynamic segments | Add `routeDiscovery.samples` |
| Mode `off` | Only listed routes run |

See [Framework guides](../frameworks/index.md).

## Configuration {#config}

**Symptom:** Config not found.

Place `a11yst.config.ts` in project root or pass `--config` / `--cwd`.

**Symptom:** Validation error on load.

Compare with [Configuration reference](../reference/configuration.md). Run TypeScript config through your editor for type errors.

## CI {#ci}

| Symptom | Fix |
| --- | --- |
| Exit 2 | Policy breach — review findings or baseline |
| Exit 1 with policy enabled | Baseline missing — commit or create baseline |
| No color in logs | Expected with `--json` or `NO_COLOR` |
| Empty `GITHUB_STEP_SUMMARY` | Set `reports.githubStepSummary` and ensure env var exists on GitHub Actions |

## Reports {#reports}

**Symptom:** Missing HTML or Markdown.

Check `--no-html`, `--no-markdown`, and config `reports.*` toggles. Output lives under `outputDir` (default `.a11yst/results/`).

Regenerate from saved JSON:

```bash
a11yst report --from .a11yst/results/latest.json --format html
```

## Source mapping {#source-mapping}

**Symptom:** No likely source on findings.

| Cause | Detail |
| --- | --- |
| `sourceAnalysis.enabled: false` | Re-enable in config |
| Minified production build | Map against dev build or provide source maps |
| Unsupported file type | Mapper may return `unmapped` |
| Wrong `rootDir` | Index scans project root scope |

Mapping is probabilistic — see [Source intelligence limitations](../source-intelligence/limitations.md).

## Getting help

- [Community](../community/index.md) — issues and contributions welcome
- `a11yst --help` and subcommand `--help` for current flags

There is no commercial support channel or enterprise ticket system.

## Related

- [Getting started](../getting-started/index.md)
- [CLI reference](../reference/cli.md)
