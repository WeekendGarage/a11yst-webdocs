---
title: Route discovery and planning
description: Explicit routes, framework-aware discovery, merge modes, fallback, audit planning, and routes --explain.
---

# Route discovery and planning

Routes are the URLs a11yst audits in the browser. You can list them explicitly in config, discover them from your application source, or combine both. Before `a11yst audit` plans runs, resolved routes are merged according to `routeDiscovery.mode`.

This page describes **application route discovery** in your project under audit—not how the a11yst documentation site is built.

## Explicit routes

List routes on each web project as path strings or objects with `id`, `name`, and `path`:

```typescript
projects: [
  {
    name: "web",
    platform: "web",
    framework: "react",
    baseUrl: "http://127.0.0.1:5173",
    routes: ["/", "/settings", "/checkout"],
  },
],
```

Explicit routes always take precedence over discovered routes with the same path. In `merge` mode, duplicates are deduplicated so each path appears once.

When `routeDiscovery.mode` is `"off"`, **only** explicit routes are used. Validation requires at least one route in that mode.

## Route discovery modes

| Mode | Default | Behavior |
| --- | --- | --- |
| `off` | no | Explicit routes only; no adapter discovery |
| `fallback` | **yes** | Discovery runs when `routes` is empty; ignored when explicit routes exist |
| `merge` | no | Combines explicit routes with discovered routes (deduped by path) |

Precedence when paths overlap (highest first):

1. **explicit** — configured in `routes`
2. **dynamic-sample** — from `routeDiscovery.samples`
3. **filesystem** / **react-jsx-route** / **react-router-object** — adapter discovery
4. **adapter-default** — framework fallback (usually `/`)

Additional config keys:

| Key | Purpose |
| --- | --- |
| `routeDiscovery.include` | Glob filters (reserved for future filtering) |
| `routeDiscovery.exclude` | Glob filters (reserved for future filtering) |
| `routeDiscovery.samples` | Map dynamic patterns to concrete paths to audit |

See [Configuration](../reference/configuration.md) for the full schema.

## Framework-aware route discovery

Each web framework uses a matching adapter. Discovery behavior depends on the adapter—not on a generic site crawler.

| Framework | Discovery strategy | Fallback when empty |
| --- | --- | --- |
| [HTML](../frameworks/html.md) | Filesystem scan for `.html` entry files | none (uses discovered paths) |
| [React](../frameworks/react.md) | Static React Router AST scan | `/` with diagnostic |
| [Next.js](../frameworks/next.md) | App Router + Pages Router scan | uses discovered paths |
| [Nuxt](../frameworks/nuxt.md) | `pages/` filesystem scan | `/` when no pages found |
| [Vue](../frameworks/vue.md) | none in this phase | `/` with diagnostic |
| [Angular](../frameworks/angular.md) | none in this phase | `/` with diagnostic |

Adapters do not execute your application or evaluate modules at runtime. Discovery is static analysis of source and project layout.

Dynamic segments (for example `/blog/:slug`) are recorded as **skipped patterns** with reason `requires configured value`. Provide concrete paths in `routeDiscovery.samples` when you want them audited:

```typescript
routeDiscovery: {
  mode: "merge",
  samples: {
    "/projects/:slug": ["/projects/demo"],
  },
},
```

## React route discovery

React projects receive dedicated static React Router analysis in `@a11yst/adapters`. This is the most capable discovery path in the current release.

### Supported patterns

| Pattern | Example | Origin |
| --- | --- | --- |
| JSX `<Route>` | `<Route path="/about" />` | `react-jsx-route` |
| Nested JSX routes | Parent `/projects` + child `featured` → `/projects/featured` | `react-jsx-route` |
| Index routes | `<Route index />` under `/projects` → `/projects` | `react-jsx-route` |
| `createBrowserRouter([...])` | Route objects with `path` / `children` | `react-router-object` |
| `createHashRouter([...])` | Same object form as browser router | `react-router-object` |
| `useRoutes([...])` | Inline or `const`-bound route arrays | `react-router-object` |
| Local path constants | `const ROOT = "/projects"; path={ROOT}` | Resolved when the value is a static string in the same file |

Router detection requires **evidence** from `package.json` (`react-router` / `react-router-dom`) and/or source imports and factory calls. React framework detection alone is not enough.

### Dynamic routes and fallback

- Dynamic segments such as `/projects/:slug` become **skipped patterns**; a11yst does not invent slug or id values.
- **`/` fallback** (`origin: adapter-default`) is used only when no React Router evidence exists or no auditable static/discovered routes are found.
- When only dynamic patterns are discovered (with static `/`), fallback is **not** used—the skipped patterns count as auditable discovery output.
- When explicit routes are configured on the project, the React adapter skips discovery entirely (returns empty discovery).

Inspect discovery:

```bash
a11yst routes --explain
```

### React limitations

- No general-purpose crawler or link extraction (`href`, `Link to`, API strings, assets).
- No runtime route generation, lazy module evaluation, or spread route configs.
- Non-static `path` expressions are reported as unresolved, not guessed.
- Custom routers or heavy runtime composition require explicit `routes`.

## Route fallback

**Adapter fallback** adds a single `/` route when an adapter cannot discover auditable paths:

| Adapter | Diagnostic code | When |
| --- | --- | --- |
| React | `REACT_ROUTES_EXPLICIT_RECOMMENDED` | No router routes discovered |
| React | `REACT_ROUTER_NOT_DETECTED` | No router evidence |
| Vue | `VUE_ROUTES_EXPLICIT_RECOMMENDED` | No filesystem discovery |
| Angular | `ANGULAR_ROUTES_EXPLICIT_RECOMMENDED` | No filesystem discovery |

Fallback routes use `origin: adapter-default`. Configure explicit routes when fallback is too coarse for your app.

**Mode `fallback`** is a config setting, not the same as adapter fallback: it means “use discovery only when `routes` is empty.”

## Route planning

Audit planning consumes **resolved** routes—not raw config alone.

1. **`prepareAuditConfig`** (in `@a11yst/core`) calls `resolveProjectRoutesForProject` for each web project. Adapter discovery and merge modes run here; diagnostics include skipped patterns as `ROUTE_PATTERN_SKIPPED`.
2. **`createAuditPlan`** expands each resolved route × profile × viewport into planned runs. Flow checkpoints are planned separately.

Example: five discovered React routes with one profile and one viewport produce five route runs. See the `react/comprehensive` fixture tests below.

Explicit routes configured with `routeDiscovery.mode: "off"` skip discovery entirely during planning.

## Route explanation (`a11yst routes --explain`)

The `routes` command resolves routes the same way as audit planning, without starting a browser.

```bash
a11yst routes [--json] [--config <path>] [--cwd <path>] [--project <name>] [--explain]
```

| Flag | Output |
| --- | --- |
| (default) | Human-readable resolved routes per project |
| `--json` | Structured JSON on stdout (no ANSI) |
| `--explain` | Adds discovery strategy, router evidence, origins, skipped patterns, explicit routes, and fallback status |

JSON fields include `routes` (with `origin`, optional `sourceFile` / `sourceLine`), `skippedPatterns`, `diagnostics`, `explain`, and `explicitRoutes`.

Human `--explain` output includes sections such as **Explain**, **Router detected**, discovered route sources, and unresolved patterns marked with `!`.

See [CLI reference](../reference/cli.md).

## Inspecting routes before an audit

```bash
a11yst routes
a11yst routes --json
a11yst routes --explain --project web
```

Use this to confirm discovery, dynamic pattern skips, and fallback before a long audit.

## Tests and fixtures

Behavior is covered by unit and integration tests in the a11yst repository.

### Unit tests

| Area | Test file |
| --- | --- |
| React discovery | `tests/unit/adapters/react-discovery.test.ts` |
| HTML discovery | `tests/unit/adapters/html-discovery.test.ts` |
| Next.js discovery | `tests/unit/adapters/next-discovery.test.ts` |
| Nuxt discovery | `tests/unit/adapters/nuxt-discovery.test.ts` |
| Merge / precedence | `tests/unit/adapters/merge.test.ts` |
| Adapter `/` fallback | `tests/unit/adapters/fallback-adapters.test.ts` |
| Config validation | `tests/unit/config/route-discovery-config.test.ts` |
| Core resolution + planning | `tests/unit/core/route-resolution.test.ts` |

### CLI integration

| Test | File |
| --- | --- |
| `a11yst routes` JSON, `--explain`, `--project` | `tests/integration/cli/routes-cli.test.ts` |

### Fixtures (`tests/fixtures/adapters/`)

| Fixture | Exercises |
| --- | --- |
| `react/jsx-routes` | JSX `<Route>` paths |
| `react/nested-routes` | Nested and index routes |
| `react/create-browser-router` | `createBrowserRouter` / hash router objects |
| `react/use-routes` | `useRoutes` arrays and local constants |
| `react/dynamic-route` | Skipped `:slug` / `:id` patterns |
| `react/false-positives` | Ignores href, API, and asset strings |
| `react/no-router` | Adapter `/` fallback |
| `react/comprehensive` | Mixed JSX + dynamic pattern + audit planning |
| `html/` | Filesystem HTML entry discovery |
| `next/app-router` | App Router pages + skipped dynamic segments |
| `nuxt/` | `pages/` scan |

Run directed tests:

```bash
pnpm vitest run tests/unit/adapters/react-discovery.test.ts \
  tests/unit/adapters/merge.test.ts \
  tests/unit/adapters/html-discovery.test.ts \
  tests/unit/adapters/next-discovery.test.ts \
  tests/unit/adapters/nuxt-discovery.test.ts \
  tests/unit/adapters/fallback-adapters.test.ts \
  tests/unit/config/route-discovery-config.test.ts \
  tests/unit/core/route-resolution.test.ts \
  tests/integration/cli/routes-cli.test.ts
```

## Related

- [Core concepts overview](index.md)
- [React projects](../frameworks/react.md)
- [Configuration](../reference/configuration.md)
- [CLI](../reference/cli.md)
