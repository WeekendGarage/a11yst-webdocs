# a11yst website

Official documentation website for a11yst.

This repository contains the public website and documentation. It is a static site built with MkDocs and Material for MkDocs.

## Requirements

- Node.js 20+
- Python 3.10+ (`python3 -m venv`)

## Bootstrap

```bash
pnpm build
pnpm test
pnpm test:browser
pnpm dev
```

The first run creates `.venv` and installs pinned dependencies from `requirements.txt`.

Browser checks need Chromium once per machine:

```bash
pnpm exec playwright install chromium
```

Optional self-audit (dogfood) uses a local a11yst CLI. This repository does not depend on `@a11yst/cli`. Without `A11YST_BIN`, dogfood tests are skipped:

```bash
export A11YST_BIN=/path/to/a11yst   # executable, or packages/cli/dist/bin.js
pnpm test:dogfood
```

Dev server default: `http://127.0.0.1:8000`

## Release gate

The standalone release check is:

```bash
pnpm gate        # delete site/, build twice, unit tests
pnpm gate:full   # plus browser checks (dogfood runs only if A11YST_BIN is set)
```

## Output

Static build output is written to `site/` (gitignored). `.venv/` and `.a11yst/` are also gitignored.
