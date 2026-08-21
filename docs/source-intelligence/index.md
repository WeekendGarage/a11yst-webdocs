---
title: Source intelligence overview
description: Source mapping and recommendations in a11yst.
---

# Source intelligence overview

After the browser audit, a11yst can attach:

| Capability | Purpose |
| --- | --- |
| [Source mapping](source-mapping.md) | Rank candidate locations in your repository |
| [Recommendations](recommendations.md) | Remediation guidance for rules and framework context |

Both are **best-effort**. They do not patch your code. Human output says **likely source** / **probable source**, not a guaranteed line.

```text
Finding → source index → framework mapper → optional ranking → optional recipes
```

`sourceAnalysis` defaults to enabled. Turn it off when you only want raw findings. Limits: [Limitations](limitations.md). Schema: [Configuration](../reference/configuration.md#sourceanalysis).
