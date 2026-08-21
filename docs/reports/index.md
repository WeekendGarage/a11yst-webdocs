---
title: Reports
description: Terminal, HTML, Markdown, JSON, SARIF, and JUnit report formats in a11yst.
---


a11yst writes human and machine output from the same audit. JSON fields: [Result model](../reference/result-model.md).

| Format | Use |
| --- | --- |
| Terminal | Local progress and findings by severity (**MINOR**–**CRITICAL**) |
| HTML | Browsable findings and evidence |
| Markdown | PRs, wikis, and review notes |
| JSON | Automation (`--json` and the results bundle) |
| SARIF | Static-analysis viewers (opt-in) |
| JUnit | CI test-report consumers (opt-in) |
