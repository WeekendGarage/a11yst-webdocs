---
title: Recommendations
description: Remediation guidance from the a11yst recommendation engine.
---

# Recommendations

Recommendations provide contextual guidance for addressing findings. They are **not** automatic fixes.

## What recommendations include

| Part | Detail |
| --- | --- |
| Rule context | Linked to the finding `ruleId` |
| Framework examples | Snippets for html, jsx, tsx, vue, angular where recipes support them |
| Actions | Concrete steps (for example associate a label with a control) |
| Verification | Manual and automated re-check steps |
| Caveats | Limits of automated guidance |

## Status values

| Status | Meaning |
| --- | --- |
| `recommended` | Recipe matched; actions suggested |
| `manual-review` | Requires human judgment (common for color-contrast) |
| `unsupported` | No recipe for this rule yet |
| `invalid` | Input could not produce guidance |

## Supported rules (current)

Recipes exist for rules including:

`button-name`, `link-name`, `image-alt`, `label`, `aria-input-field-name`, `aria-dialog-name`, `html-has-lang`, `document-title`, `color-contrast`, `heading-order`, `landmark-one-main`, `duplicate-id-aria`, `aria-valid-attr-value`, `aria-required-attr`

Other rules receive generic manual-review guidance when unsupported.

## Example presentation

```text
Recommendation
  Ensure each social link exposes an accessible name via visible text or aria-label.
```

Wording comes from the recommendation engine, not from a third-party scanner brand.

## Limitations

- Recommendations do not edit your repository.
- They may suggest patterns that need adaptation to your design system.
- When source mapping is uncertain, caveats note missing source context.

See [Limitations](limitations.md).

## Configuration

```typescript
sourceAnalysis: {
  recommendations: true,
},
```

Disable:

```typescript
sourceAnalysis: { recommendations: false },
```

## JSON

Findings include `recommendations` with `status`, `recommendations[]`, and optional `diagnostics`.

See [Result model](../reference/result-model.md).
