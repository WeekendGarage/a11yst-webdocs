---
title: Source intelligence limitations
description: Accuracy limits for source mapping and recommendations.
---

# Limitations

Source intelligence does not replace manual accessibility review. Browser audits reflect the rendered DOM at audit time; they do not fully simulate assistive technologies.

## Source mapping

| Condition | Typical outcome |
| --- | --- |
| Production minified assets | Weak or unmapped |
| Client-only components | Candidate may point to a wrapper |
| Third-party widgets | May map only to the integration boundary |
| Multiple matching components | `ambiguous`, with ranked candidates |

Never treat **likely source** as proof of compliance without checking the file.

## Recommendations

They do not apply patches, may need design or content decisions, and ask for manual verification on subjective rules (contrast, visual design).

Mappers exist for html, react, next, vue, nuxt, and angular. Keyboard, large-text, and reduced-motion findings may map or recommend less completely than axe-sourced rules.

With `sourceAnalysis.enabled: false`, findings still include severity, evidence, and reports — without mapping or recipes.
