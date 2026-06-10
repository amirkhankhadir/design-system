# Design System — Rules for Claude

## Tokens

- **Never add new tokens without consulting the user first.**
- Use only semantic tokens (`--ds-color-*`, `--ds-spacing-*`, `--ds-radius-*`, `--ds-sizing-*`) — never primitives, never hardcoded values.
- Tokens live in `tokens/semantics.json` → built via `build-tokens.js` → output `dist/web/tokens.light.css` + `tokens.dark.css`.

## Component CSS

- **Hover/active states via surface overlay only** — `::after` pseudo-element with `var(--ds-color-surface-1)` on hover, `var(--ds-color-surface-2)` on active.
- Never use `filter: brightness()` or hardcoded RGBA for states.
- **Danger + disabled block always placed last** in the CSS file to correctly override danger color rules via specificity.
- `disabled={disabled || loading}` in TSX — loading locks interaction and renders visually disabled; pick a loader color that's visible on `background-muted`.

## Loader colors

Valid `LoaderColor` values: `'brand' | 'inverse' | 'on-brand' | 'static-white' | 'static-black'`

- Solid-bg variants (primary, secondary, tertiary): `'inverse'` — visible on `background-muted` gray.
- Transparent-bg variants (link, ghost): `'brand'` — visible on any light background.

## Storybook stories

### Sidebar structure

Sections order (enforced via `storySort` in `preview.tsx`):

```
Getting Started → Foundations → Components → Utilities
```

### Grouping rules

1. **Group by family** — related components share a subfolder in `title`.
   - Example: `Button` + `IconButton` → `Components/Buttons/Button` and `Components/Buttons/IconButton`.
   - When adding a new component, check if it belongs to an existing family before creating a new top-level group.

2. **Utilities are separate** — building-block components that are not used standalone go under `Utilities/`, not `Components/`.
   - Current utilities: `Icon`, `Loader`.
   - A component is a utility if: consumers rarely use it directly; it exists to compose other components.

### Story content rules

- **Sizes story** — show only the primary variant in sm/md/lg, mirroring the Button pattern. Never show all variants × all sizes.
- **No Danger / Loading / Focus standalone stories** — these states are shown inline in the All Variants grid, not as separate sidebar entries.
- Use a neutral, representative icon for icon-related stories (currently `home`).
