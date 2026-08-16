---
title: Contributing
description: How to contribute issues, documentation, and code to a11yst.
---


Thank you for helping improve a11yst.

## Ways to contribute

- **Issues welcome** — report bugs and propose improvements with reproduction steps when possible.
- **Pull requests welcome** — propose focused changes with tests where behavior changes.
- **Documentation PRs welcome** — improve guides, examples, and website content.
- **Code PRs welcome** — follow repository development commands and testing guidance.

Issues, bug reports, and feature proposals do **not** require a CLA.

## CLA and merge policy

External code merge will require the **CLA workflow once active**.

Current CLA status: **not active**.

Until CLA activation, external code pull requests cannot be merged even when technically ready. Publication is not blocked by an inactive CLA.

Do not submit personal identity information as part of contribution discussions.

## Development

From the repository root:

```bash
pnpm build
pnpm dev
```

Bootstrap (first time): Python 3.10+ with `python3 -m venv` available. The website scripts create `.venv` and install pinned MkDocs dependencies automatically.

See the repository `README.md` for current website commands.

## Accessibility claims

Automated checks do not establish accessibility conformance and do not replace manual testing.
