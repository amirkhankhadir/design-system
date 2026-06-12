# Backlog

Items agreed but not yet started. Add new items here, mark done with ✅.

---

## ✅ A — Contrast token fixes (done)

Apply the following semantic token changes (all values from existing primitives).
Visual before/after reference: `contrast-audit.html` at repo root.

| Semantic token | Current primitive | New primitive | Contrast change |
|---|---|---|---|
| `brand-default`, `brand-text` | `primary/40` (#039be6) | `primary/20` (#007bbd) | 3.07 → 4.60 ✅ |
| `text-tertiary` | `neutral/40` (#8b8b8b) | `neutral/30` (#737373) | 3.41 → 4.74 ✅ |
| `success-default`, `success-border` | `success/30` (#2db77b) | `success/20` (#1e9863) | 2.57 → 3.67 ✅ |
| `warning-default`, `warning-border` | `warning/50` (#ffa530) | `warning/30` (#c8760b) | 1.97 → 3.47 ✅ |

**Scope per fix — touch all three layers:**
1. Figma: update `brand-theme-semantics` variable values (Light + Dark modes)
2. Token source files: update semantic → primitive mappings
3. `npm run build` → regenerates `dist/web/tokens.light.css` + `tokens.dark.css`
4. Verify Storybook Colors story renders correctly

---

## ✅ B — Accessibility / Contrast documentation page in Storybook (done)

Create `Accessibility.stories.tsx` under `title: 'Foundations'`.

Content:
- Intro: WCAG 2.1 AA requirements (4.5:1 text, 3:1 UI)
- Contrast matrix table: all semantic token pairs with ratios and pass/fail
- Live swatches (same style as Colors story)
- Note on disabled-state exemption

Replaces `contrast-audit.html` as the canonical reference. Remove `contrast-audit.html` when done.
