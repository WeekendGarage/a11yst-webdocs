# a11yst website

Official documentation website for a11yst.

**a11yst** — Your accessibility analyst.

This repository contains the public website and documentation. It is a static site built with MkDocs and Material for MkDocs.

## Requirements

- Node.js 20+
- Python 3.10+ (`python3 -m venv`)

## Bootstrap

```bash
pnpm build
pnpm dev
```

The first run creates `.venv` and installs pinned dependencies from `requirements.txt`.

Dev server default: `http://127.0.0.1:8000`

## Output

Static build output is written to `site/` (gitignored).
