---
title: Source intelligence limitations
description: Accuracy limits for source mapping and recommendations.
---

# Limitations

Source intelligence improves developer workflow but cannot replace manual accessibility review.

## Automated testing limits

Browser audits reflect rendered DOM at audit time. They do not fully simulate all assistive technologies or every user interaction path.

## Source mapping uncertainty

| Condition | Typical outcome |
| --- | --- |
| Production minified assets | Weak or unmapped |
| Client-only components | Candidate may point to wrapper, not leaf |
| Third-party widgets | May map to integration boundary only |
| Multiple matching components | `ambiguous` status with ranked candidates |

Never treat **likely source** as proof of compliance or exact blame without verification.

## Recommendations are guidance

Recommendations:

- do not apply patches
- may require design or content decisions
- include manual verification steps for subjective rules (contrast, visual design)

## Framework coverage

Mappers exist for html, react, next, vue, nuxt, angular. Other detected frameworks may audit successfully with limited or no mapping.

## Heuristic and profile findings

Keyboard, large-text, and reduced-motion profiles add a11yst-owned rules. Recommendations and mapping coverage differ from core axe-sourced rules.

## When mapping is disabled

```typescript
sourceAnalysis: { enabled: false },
```

Findings still include severity, evidence, and reports — without mapping or recommendations.

## Related

- [Source mapping](source-mapping.md)
- [Recommendations](recommendations.md)
- [Troubleshooting](../troubleshooting/index.md)
