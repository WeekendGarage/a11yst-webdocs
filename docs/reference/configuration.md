---
title: Configuration reference
description: a11yst.config schema, defaults, discovery, and precedence.
---

# Configuration reference

Canonical basename: **`a11yst.config.*`**

## Supported file formats

| Filename |
| --- |
| `a11yst.config.ts` |
| `a11yst.config.mts` |
| `a11yst.config.js` |
| `a11yst.config.mjs` |

JSON and YAML are **not** supported by the config loader.

Use `defineConfig` from `@a11yst/config` for TypeScript typings.

## Discovery

The loader walks up from `--cwd` (default process cwd) searching for config filenames. `--config <path>` loads an explicit file.

Environment variables from your shell are available when the config module is evaluated (standard Node behavior). There are no built-in `A11YST_*` config overrides — see [Environment variables](environment-variables.md).

## Top-level fields

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `projects` | array | **required** | One or more project definitions |
| `outputDir` | string | `.a11yst/results` | Audit output directory |
| `reports` | object | see below | Report toggles |
| `evidence` | object | screenshots on | Evidence capture |
| `baseline` | object | compare on | Baseline file settings |
| `ci` | object | gates off | CI policy defaults |
| `sourceAnalysis` | object | all on | Mapping and recommendations |

### reports

| Field | Default |
| --- | --- |
| `html` | `true` |
| `markdown` | `true` |
| `sarif.enabled` | `false` |
| `junit.enabled` | `false` |
| `githubAnnotations.enabled` | `false` |
| `githubStepSummary.enabled` | `false` |

### evidence

| Field | Default |
| --- | --- |
| `screenshots` | `true` |
| `fullPage` | `false` |

### baseline {#baseline}

| Field | Default |
| --- | --- |
| `file` | `.a11yst/baseline.json` |
| `compare` | `true` |
| `classifications` | `true` |

### ci {#ci}

| Field | Default |
| --- | --- |
| `failOnNew` | `false` |
| `failOnRegression` | `false` |
| `failOnExpiredClassification` | `false` |
| `minimumSeverity` | `high` |

### sourceAnalysis {#sourceanalysis}

| Field | Default |
| --- | --- |
| `enabled` | `true` |
| `ranking` | `true` |
| `recommendations` | `true` |

## Web project fields

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `name` | yes | — | Unique project id |
| `rootDir` | no | `.` | Project root relative to config |
| `platform` | yes | — | `"web"` |
| `framework` | no | `unknown` | html, react, next, vue, nuxt, angular, … |
| `baseUrl` | * | — | Target origin |
| `devServer.url` | * | — | Server URL (* one required) |
| `devServer.command` | no | — | Start command |
| `devServer.reuseExisting` | no | `true` | Reuse running server |
| `devServer.startupTimeout` | no | `60000` | ms |
| `routes` | no | `[]` | Path strings or `{ id, path, name }` |
| `routeDiscovery.mode` | no | `fallback` | `off`, `fallback`, `merge` |
| `routeDiscovery.include` | no | `[]` | Glob filters |
| `routeDiscovery.exclude` | no | `[]` | Glob filters |
| `routeDiscovery.samples` | no | `{}` | Dynamic route samples |
| `readiness.waitUntil` | no | `domcontentloaded` | `load`, `domcontentloaded` |
| `readiness.selector` | no | — | Wait for selector |
| `readiness.timeout` | no | navigation timeout | ms |
| `readiness.settleFrames` | no | adapter default | Animation settle frames |
| `viewports` | no | 1440×900 desktop | Viewport list |
| `profiles` | no | `["default"]` | Profile ids |
| `flows` | no | `[]` | User flow definitions |

### Profile options

| Profile | Notable defaults |
| --- | --- |
| `keyboard` | `maxTabStops: 50`, `detectFocusTraps: true` |
| `large-text` | `textScale: 1.25`, `detectHorizontalOverflow: true` |
| `reduced-motion` | `emulatePreference: true`, `inspectAnimations: true` |

## Native (React Native) projects

`platform: "react-native"` — planning-only in current web-focused release. Web-only fields are rejected.

## Precedence {#precedence}

| Setting | Resolution order |
| --- | --- |
| CI policy | CLI flags → config `ci` → built-in defaults |
| Reports / SARIF / JUnit | CLI `--no-*` / `--sarif` → config `reports` |
| Baseline path | CLI `--baseline` → config `baseline.file` |
| Config file | `--config` → walk-up discovery |
| Target URL | `baseUrl` overrides mismatch with `devServer.url` (warning if different) |

CLI flags on `audit` override config for CI policy when explicitly passed.

## Workspace / monorepo

Each project has its own `rootDir` relative to the config file directory. Run from the package that contains `a11yst.config.*` or pass `--cwd`.

Use multiple projects in one config for monorepos:

```typescript
export default defineConfig({
  projects: [
    { name: "web", platform: "web", framework: "react", rootDir: "apps/web", /* … */ },
    { name: "docs", platform: "web", framework: "html", rootDir: "apps/website", /* … */ },
  ],
});
```

## Example

```typescript
import { defineConfig } from "@a11yst/config";

export default defineConfig({
  outputDir: ".a11yst/results",
  ci: { failOnNew: true, minimumSeverity: "high" },
  projects: [
    {
      name: "app",
      platform: "web",
      framework: "react",
      baseUrl: "http://127.0.0.1:5173",
      devServer: { command: "pnpm dev", url: "http://127.0.0.1:5173" },
      routes: ["/", "/settings"],
      profiles: ["default", "keyboard"],
    },
  ],
});
```

## Related

- [CLI reference](cli.md)
- [Framework guides](../frameworks/index.md)
