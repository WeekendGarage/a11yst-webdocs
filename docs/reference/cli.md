---
title: CLI reference
description: Complete a11yst command-line interface reference.
---

# CLI reference

```bash
a11yst [options] [command]
```

## Global options

| Option | Default | Description |
| --- | --- | --- |
| `-V, --version` | — | Print version |
| `--progress <mode>` | `auto` | Progress feedback: `auto`, `always`, `never` |
| `--no-progress` | — | Disable progress |
| `-h, --help` | — | Show help |

Progress is disabled when `--json` is used on supported commands.

## Commands

### detect

Detect platform, framework, and package manager.

```bash
a11yst detect [--json] [--workspace] [--cwd <path>]
```

### init

Create a starter configuration file.

```bash
a11yst init [--force] [--platform web|react-native] [--framework <id>] \
  [--base-url <url>] [--dev-command <cmd>] [--cwd <path>] [--json]
```

### audit

Run an accessibility audit.

```bash
a11yst audit [options]
```

| Option | Description |
| --- | --- |
| `--json` | Machine-readable JSON on stdout |
| `--config <path>` | Config file path |
| `--cwd <path>` | Working directory for config discovery |
| `--headed` | Visible browser |
| `--timeout <ms>` | Navigation timeout (default 30000) |
| `--no-start-server` | Fail if target not already listening |
| `--project <name>` | Repeatable project filter |
| `--profile <id>` | Repeatable profile filter |
| `--flow <id>` | Repeatable flow filter |
| `--flows-only` | Skip static routes |
| `--routes-only` | Skip flows |
| `--flow-timeout <ms>` | Flow step timeout (default 10000) |
| `--output <path>` | Results directory |
| `--no-html` | Skip HTML report |
| `--sarif` / `--no-sarif` | SARIF generation |
| `--sarif-output <path>` | Extra SARIF path |
| `--junit` / `--no-junit` | JUnit generation |
| `--junit-output <path>` | Extra JUnit path |
| `--no-markdown` | Skip Markdown report |
| `--markdown-output <path>` | Extra Markdown path |
| `--github-annotations` / `--no-github-annotations` | Annotation commands file |
| `--github-annotations-output <path>` | Extra annotations path |
| `--github-step-summary` / `--no-github-step-summary` | Append to `GITHUB_STEP_SUMMARY` |
| `--no-screenshots` | Disable evidence screenshots |
| `--full-page-screenshots` | Full-page captures |
| `--no-baseline` | Skip baseline comparison |
| `--baseline <path>` | Baseline file path |
| `--create-baseline` | Write baseline after audit |
| `--force` | Overwrite baseline with `--create-baseline` |
| `--fail-on-new` / `--no-fail-on-new` | CI policy |
| `--fail-on-regression` / `--no-fail-on-regression` | CI policy |
| `--fail-on-expired-classification` / `--no-fail-on-expired-classification` | CI policy |
| `--minimum-severity <level>` | `minor`, `medium`, `high`, `critical` |
| `--color <mode>` | `auto`, `always`, `never` (default `auto`) |
| `--verbose` | Extra technical detail in human output |

### profiles

List accessibility profiles.

```bash
a11yst profiles [--json]
```

### report

Regenerate reports from persisted results.

```bash
a11yst report [resultsPath] [--from <path>] [--format html|sarif|junit|markdown|github-annotations] \
  [--output <path>] [--json] [--cwd <path>]
```

### flows

List configured flows (no browser).

```bash
a11yst flows [--json] [--config <path>] [--cwd <path>] [--project <name>]
```

### doctor

Environment readiness checks.

```bash
a11yst doctor [--json] [--cwd <path>]
```

Exit **0** for ok/warn, **1** for fail.

### baseline

Subcommands: `create`, `status`, `update`, `migrate`. Run `a11yst baseline --help` for flags.

### findings

```bash
a11yst findings [--json] [--from <path>] [--config <path>] [--cwd <path>] \
  [--status new|known|regressed|resolved] [--disposition <id>] \
  [--project <name>] [--rule <id>] [--profile <id>] [--flow <id>] [--checkpoint <id>]
```

### classify / unclassify

```bash
a11yst classify <finding-id> --disposition <id> --reason <text> [--yes] ...
a11yst unclassify <finding-id> [--yes] ...
```

### routes

```bash
a11yst routes [--json] [--config <path>] [--cwd <path>] [--project <name>] [--explain]
```

## Color behavior

| Mode | Behavior |
| --- | --- |
| `auto` | Color when stderr is a TTY, not dumb, not CI-suppressed |
| `always` | Force ANSI color |
| `never` | No ANSI color |

Also respected: `NO_COLOR`, `FORCE_COLOR=0`, `--json` (no color on machine output).

## Machine output

Commands supporting `--json` emit structured data on stdout without ANSI styling. Use `--color never` and `--progress never` in CI parsers.

## Related

- [Configuration](configuration.md)
- [Exit codes](exit-codes.md)
