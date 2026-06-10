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

---

## Figma component building rules

### Naming — all kebab-case, matching code

Everything in Figma must use the same naming as the code (kebab-case):

| Thing | Example |
|---|---|
| Page names | `buttons`, `icon-button`, `icons`, `loader` |
| Component set name | `button`, `icon-button` |
| Variant property keys | `variant`, `size`, `state` |
| Variant values | `primary`, `sm`, `default`, `has-left-icon` |
| Component property names | `label`, `has-left-icon`, `icon-left`, `icon-right` |

Never use TitleCase, camelCase, or spaces in Figma naming.

### States — always include interaction states

Every interactive component must include these states in the `state` variant:
`default | hover | pressed | disabled | loading | danger`

- **hover**: overlay frame filled with `color/surface/1` (ABSOLUTE, STRETCH constraints)
- **pressed**: overlay frame filled with `color/surface/2` (ABSOLUTE, STRETCH constraints)
- This mirrors the `::after` overlay pattern used in code exactly.

### Sizing

- Interactive components (buttons, icon-buttons) use **HUG width** by default (`primaryAxisSizingMode = 'AUTO'`).
- Height is always **fixed** (`counterAxisSizingMode = 'FIXED'`) bound to the correct sizing token.

### Icons in components

When a component has icon props in code:
1. Create an **icons page** first with icon components (if it doesn't exist).
2. Add icon slots as **instances** of icon components (not plain frames).
3. Add **`has-left-icon`** and **`has-right-icon`** boolean properties → linked to instance visibility.
4. Add **`icon-left`** and **`icon-right`** INSTANCE_SWAP properties → linked to instance mainComponent.
5. Icon sizes must match code: **16px** (sm), **20px** (md/lg).

### Dependencies — check before building

Before building any Figma component, check if it depends on another component:
- Button Loading state → needs **Loader** component
- Any icon slot → needs **icons** page with icon components

**If a dependency is missing: stop, flag it explicitly, and ask whether to build the dependency first.**
Never silently skip a dependency (e.g. showing Loading state without a loader visual).

### Token bindings — bind everything

Every visual property must be bound to a token variable:
- Fill colors → `brand-theme-semantics` variables
- Stroke colors → same
- Corner radius → `display-semantics / radius/*`
- Padding → `display-semantics / spacing/*`
- Gap → `display-semantics / spacing/*`
- Height → `display-semantics / sizing/*`
- Border width → `display-semantics / border/width/*`

### Component properties — map to code props

Figma component properties must map 1:1 to code props for Code Connect:

| Figma property | Type | Code prop |
|---|---|---|
| `variant` | VARIANT | `variant` |
| `size` | VARIANT | `size` |
| `state` | VARIANT | `disabled` / `loading` / `danger` (mapped in CC) |
| `label` | TEXT | `children` |
| `has-left-icon` | BOOLEAN | presence of `iconLeft` |
| `has-right-icon` | BOOLEAN | presence of `iconRight` |
| `icon-left` | INSTANCE_SWAP | `iconLeft` string value |
| `icon-right` | INSTANCE_SWAP | `iconRight` string value |
