# Design System — Rules for Claude

---

## Current State of the Design System

> **Read this section at the start of every session.** Before building anything new, check what already exists and follow the established patterns. Consistency is the primary goal of a design system.

---

### What's been built

#### Code (`packages/web/src/components/`)

| Component | Files | Storybook title | Notes |
|---|---|---|---|
| `Button` | `Button.tsx`, `Button.css`, `Button.stories.tsx` | `Components/Buttons/Button` | 4 variants × 3 sizes, loading/danger/disabled |
| `IconButton` | `IconButton.tsx`, `IconButton.css`, `IconButton.stories.tsx` | `Components/Buttons/IconButton` | 5 variants (adds ghost) × 3 sizes |
| `Icon` | `Icon.tsx`, `Icon.stories.tsx` | `Utilities/Icon` | Wraps `@material-symbols/svg-400` |
| `Loader` | `Loader.tsx`, `Loader.css`, `Loader.stories.tsx` | `Utilities/Loader` | SVG spinner, 5 color variants, any px size |

#### Figma (file `SmpZhN2JSWj1F6NplzoGUN`)

| Page | Component set | ID | Variants | Status |
|---|---|---|---|---|
| `buttons` | `button` | `203:2` | 72 (4 variants × 3 sizes × 6 states) | ✅ complete |
| `icons` | individual icon components | — | set by user | ✅ user-managed |
| `loader` | `loader` | `209:18` | 5 (color=brand/inverse/on-brand/static-white/static-black) | ✅ complete |

---

### Established patterns — must be followed by all new components

#### CSS / code patterns
- **Hover/active**: `::after` pseudo-element with `var(--ds-color-surface-1)` / `var(--ds-color-surface-2)`. Never `filter: brightness()` or hardcoded rgba.
- **Typography**: `ds-text-small-2` (12px/16px/600) for `sm`, `ds-text-medium-2` (14px/20px/600) for `md`/`lg`.
- **Sizes**: `sm` / `md` / `lg` — heights bound to `sizing/32`, `sizing/40`, `sizing/48`.
- **Loading**: `disabled={disabled || loading}`. Loader color: `'inverse'` on solid-bg variants, `'brand'` on transparent-bg variants.
- **Danger+disabled block**: always last in CSS file to win specificity.
- **Font**: Source Sans 3 via `@fontsource/source-sans-3`.
- **Icons**: `@material-symbols/svg-400`, sizes 16px (sm) / 20px (md/lg).

#### Figma component patterns
- **All names**: kebab-case matching code props.
- **States**: `default | hover | pressed | disabled | loading | danger` on every interactive component.
- **Hover/pressed**: ABSOLUTE rectangle overlay, fills `color/surface/1` / `color/surface/2`, STRETCH constraints.
- **Width**: HUG (`primaryAxisSizingMode = 'AUTO'`). Always verify with screenshot after setting.
- **Loading state**: all content slots `opacity=0` (not `visible=false`), `ds-loader` instance ABSOLUTE CENTER.
- **Stroke**: always bind via `setBoundVariable('strokeWeight', borderWidthVar)`, never hardcode.
- **All fills/strokes/radius/spacing**: bound to variables, never hardcoded.

#### Token architecture
- 4 Figma variable collections: `global-primitives`, `brand-theme-semantics` (Light + Dark modes), `typography`, `display-semantics`
- CSS output: `dist/web/tokens.light.css` + `tokens.dark.css`
- Key token prefixes: `--ds-color-*`, `--ds-spacing-*`, `--ds-radius-*`, `--ds-sizing-*`

#### Tooling (`packages/web`)

| Tool | Config file | Run |
|---|---|---|
| TypeScript | `tsconfig.json` | `npx tsc --noEmit` |
| ESLint | `eslint.config.js` | `npm run lint` |
| Prettier | `.prettierrc` | `npm run format:check` |
| Stylelint | `.stylelintrc.json` | `npm run lint:css` |

- **ESLint**: flat config (ESLint 9/10), React + TypeScript rules, Prettier disables conflicting rules at the end.
- **Prettier**: `singleQuote`, `semi`, `tabWidth: 2`, `trailingComma: es5`, `printWidth: 100`, `arrowParens: avoid`.
- **Stylelint**: `stylelint-config-standard` base. `no-descending-specificity: null` — disabled because our `:not(:disabled)` overlay pattern is intentional. `value-keyword-case: lower` with `camelCaseSvgKeywords: true` (allows `currentColor`).

#### Library build
- Script: `npm run build:lib` (uses `vite.lib.config.ts`)
- Output: `dist/lib/index.js` (ESM), `dist/lib/index.d.ts` (types), `dist/lib/index.css` (all component styles bundled)
- `react` and `react-dom` are **external** — not bundled
- Consumers must import styles separately: `import '@design-system/web/styles'`
- **Icon in production**: `Icon` fetches SVGs from `/__icons/{variant}/{name}.svg` at runtime — served by `materialIconsPlugin`. Consumer apps must add the plugin to their `vite.config.ts`:
  ```ts
  import { materialIconsPlugin } from '@design-system/web/vite-plugin';
  export default defineConfig({ plugins: [react(), materialIconsPlugin()] });
  ```
  Plugin source: `src/vite-plugin-material-icons.ts` → built to `dist/lib/vite-plugin.js`.
  Without the plugin: icons fall back to a placeholder outline square (graceful degradation).

#### Changesets (versioning)
- Config: `.changeset/config.json` (root)
- Workflow: `npm run changeset` → describe change → `npm run version` → `npm run release`
- Package name `@design-system/web` requires an npm org (`@design-system`) to publish publicly.

#### CI (`github/workflows/ci.yml`)
Steps in order: install root deps → build tokens → install web deps → type-check → lint → lint:css → format:check → build-storybook.
Triggers: push to `main` + all PRs.

---

### Consistency checklist — run before shipping any new component

Before considering a new component done, verify:

**Code:**
- [ ] All CSS values use semantic tokens — no hardcoded colors, sizes, radii, or spacing
- [ ] Hover/active use the `::after` overlay pattern (not brightness or opacity tricks)
- [ ] Loading state: `disabled={disabled || loading}`, loader color chosen per bg type, content slots `opacity=0`
- [ ] Danger+disabled CSS block is at the bottom of the file
- [ ] `npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit` — all pass
- [ ] New component exported from `src/index.ts`
- [ ] Storybook: correct `title` grouping, Sizes story shows primary variant only, no standalone Danger/Loading/Focus stories

**Figma:**
- [ ] Page name, component name, and all property names are kebab-case
- [ ] All states present, hover/pressed overlays exist, loading shows `ds-loader`
- [ ] All visual properties bound to variables (fill, stroke, strokeWeight, radius, padding, gap, height)
- [ ] HUG width verified by screenshot (not just set in code)
- [ ] Loader/icon dependencies created before the component that uses them
- [ ] **Structural check on absolute children**: overlay at x=0,y=0 fills component; loader/centered elements at `(compW-childW)/2`. Always verify programmatically — screenshot alone is not enough

---

## Known Mistakes (self-documented — add every new one here)

Each entry: what went wrong, why, and the correct behaviour.

---

### 1. Claiming HUG width was applied when it wasn't
**What happened:** Set `primaryAxisSizingMode = 'AUTO'` in the script, reported it as done. Figma still showed fixed width. User had to fix manually.
**Why:** The code ran without error but the property wasn't actually taking effect — I didn't verify with a screenshot or metadata check.
**Rule:** After setting any sizing mode, always screenshot and check `width` in the returned metadata. Never report "done" without visual or data confirmation.

---

### 2. Silently skipping a dependency instead of flagging it
**What happened:** Built Button's `state=loading` without a Loader component in Figma. Loading looked identical to Disabled — no spinner was shown. Didn't flag this upfront.
**Why:** I ignored the dependency check step.
**Rule:** Before building any component state that references another component, check if that component exists in Figma. If not — stop, say so explicitly, and ask whether to build the dependency first. This rule is already in CLAUDE.md under "Dependencies — check before building" but I skipped it.

---

### 3. Loader built with fill+innerRadius instead of stroke
**What happened:** Used `arcData` with `innerRadius=0.6` and a FILL to simulate the spinner ring. Looked like a thick donut wedge — nothing like the SVG spinner in Storybook.
**Why:** Didn't read the actual `Loader.tsx` / `Loader.css` code before building the Figma component. Guessed the visual.
**Rule:** Before building any Figma component, read the real code implementation first. The Loader is two SVG `<circle>` elements with `stroke` only (no fill): a full-circle track at `opacity: 0.16` and a 75% arc with `stroke-linecap: round`. Replicate stroke mechanics, not fill mechanics.

---

### 4. Figma vectorPaths does not support the `A` (arc) SVG command
**What happened:** Tried to use `M x y A rx ry ... ex ey` in `vectorPaths.data`. Figma threw "Invalid command at A".
**Why:** Assumed Figma supports full SVG path syntax.
**Rule:** `vectorPaths` in the Figma Plugin API only supports: `M`, `L`, `C`, `Q`, `Z`. Arcs (`A`) must be converted to cubic Bezier curves. For circular arcs use k = 4*(√2−1)/3 ≈ 0.5523 per 90° segment.

---

### 5. Used `has-*` instead of `show-*` for boolean visibility properties
**What happened:** Named Figma boolean properties `has-left-icon`, `has-right-icon`.
**Rule:** Use `show-*` prefix for boolean visibility toggles. E.g. `show-left-icon`, `show-right-icon`.

---

### 6. `strokeWeight` hardcoded instead of bound to a variable
**What happened:** Set `strokeWeight = 1` directly on button variants. Border width token `border/width/1` existed but was never applied.
**Rule:** Always bind `strokeWeight` via `node.setBoundVariable('strokeWeight', borderWidthVar)`. Never hardcode it.

---

### 7. Used `visible=false` for loading state instead of `opacity=0`
**What happened:** Initially hid icon slots in `state=loading` with `visible = false`. This removes the node from the auto-layout flow, causing the button to shrink.
**Rule:** In `state=loading`, hide all content (text, icon-left, icon-right) via `opacity = 0`, not `visible = false`. This keeps nodes in layout flow, preserving button width — mirrors `visibility: hidden` in CSS.

---

### 9. Added Node.js file to `src/` without updating tsconfig
**What happened:** Created `src/vite-plugin-material-icons.ts` using `node:path`, `node:fs`, `node:url`. TypeScript threw `Cannot find module 'node:path'` because `tsconfig.json` didn't include `"types": ["node"]`.
**Rule:** Any file in `src/` that uses Node.js built-ins needs `@types/node` installed and `"types": ["node"]` in `tsconfig.json`.

---

### 10. Broad `[class*="..."]` selectors in DARK_OVERRIDE catching component classes
**What happened:** `DARK_OVERRIDE` in `preview.tsx` had `[class*="label"]` and `[class*="secondary"]` selectors targeting Storybook UI text. These accidentally matched `span.btn__label` (button text element) and `.btn--secondary`, applying `color: text-secondary !important` and overriding the button's own color rules. Result: Link buttons showed wrong text color, Secondary Danger showed wrong text color.
**Why:** CSS substring attribute selectors `[class*="foo"]` match ANY element whose class attribute contains that substring — including component classes like `btn__label` and `btn--secondary`.
**Rule:** Never use lowercase substring attribute selectors (`[class*="label"]`, `[class*="secondary"]`, `[class*="heading"]`) broadly in Storybook overrides. Storybook's own CSS module class names use PascalCase (e.g., `StoriesHeader`, `GroupTitle`) — use those exclusively. For argstable-specific overrides, always scope with `.docblock-argstable [class*="..."]`.

---

### 11. Absolute child nodes (overlay, loader) at wrong positions after component creation

**What happened:** 90 icon-button variants were built and screenshot-verified as "done". In reality, `overlay` rectangles were at x=-30, y=-38 (should be x=0, y=0) and `loader` instances were off-center. The screenshot at 0.5x scale didn't reveal this because:
- overlay is invisible in `state=default` (it only activates on hover/pressed)
- at small scale a few-pixel offset on 24px elements is not noticeable visually

**Why:** Child node x/y coordinates were calculated incorrectly during creation (likely using canvas coordinates instead of local component coordinates). The script succeeded without errors so I assumed the positions were correct.

**Rule:** After building any Figma component that contains ABSOLUTE child nodes (overlay, loader, centered icons), always run a programmatic structural check — not just a screenshot. Specifically:
- **Overlay**: must have `x === 0`, `y === 0`, `width === comp.width`, `height === comp.height`
- **Centered elements** (loader, centered icon): must have `x === (comp.width - child.width) / 2`, `y === (comp.height - child.height) / 2`

Always return these values from the creation script and assert them before reporting done:
```js
// After building, verify key children
const overlay = comp.findOne(n => n.name === 'overlay');
const loader  = comp.findOne(n => n.name === 'ds-loader');
console.assert(overlay.x === 0 && overlay.y === 0, 'overlay misaligned');
if (loader) {
  const cx = (comp.width - loader.width) / 2;
  const cy = (comp.height - loader.height) / 2;
  console.assert(Math.abs(loader.x - cx) < 1, 'loader x misaligned');
  console.assert(Math.abs(loader.y - cy) < 1, 'loader y misaligned');
}
```

Screenshot alone is **insufficient** for layout precision — it is only a visual sanity check, not a structural one.

---

### 8. Removed package without removing it from Storybook addons
**What happened:** Uninstalled `@chromatic-com/storybook` from `package.json` but left it in `.storybook/main.ts` addons list. This would break `storybook build` with "Cannot find module" error.
**Rule:** When removing a Storybook addon package, always update `.storybook/main.ts` at the same time. The two files must stay in sync.

---

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

### Component set frame — layout, background, border

Every component set frame must follow this exact pattern. Apply it AFTER `combineAsVariants`, since that call resets fills/strokes to defaults.

#### Layout grid — 24px everywhere
- **Padding**: 24px on all 4 sides  
- **Gap between variants**: 24px horizontally and vertically (uniform — no special group gaps)  
- **Column slot width**: equal to the largest variant width in the set (e.g. 40px for lg icon-button)  
- Each item **centered** inside its column slot: `x = PAD + col * (CELL_W + GAP) + (CELL_W - itemW) / 2`  
- Frame resized exactly to fit: `width = PAD + N_cols * CELL_W + (N_cols-1) * GAP + PAD`

```js
const GAP = 24, PAD = 24, CELL_W = 40; // adjust CELL_W to largest variant
// x for each item:
comp.x = PAD + col * (CELL_W + GAP) + Math.round((CELL_W - comp.width) / 2);
// y: accumulate PAD + row heights + GAP for each row
compSet.resize(frameW, frameH);
```

#### Background fill → `color/background/default`
```js
const bgVar = await figma.variables.getVariableByIdAsync('VariableID:71:76'); // color/background/default
let paint = { type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1 };
compSet.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', bgVar)];
```

#### Purple dashed border — Figma component-set style
```js
compSet.strokes      = [{ type: 'SOLID', color: { r: 0.592, g: 0.278, b: 1.0 } }]; // #9747FF
compSet.strokeWeight = 2;
compSet.strokeAlign  = 'INSIDE';
compSet.dashPattern  = [10, 5];
```

**Variable ID**: `color/background/default` = `VariableID:71:76`  
**Purple color**: `#9747FF` = `{ r: 0.592, g: 0.278, b: 1.0 }`

### Token bindings — bind everything

Every visual property must be bound to a token variable:
- Fill colors → `brand-theme-semantics` variables
- Stroke colors → same
- Corner radius → `display-semantics / radius/*`
- Padding → `display-semantics / spacing/*`
- Gap → `display-semantics / spacing/*`
- Height → `display-semantics / sizing/*`
- **Border width → `display-semantics / border/width/*`** — never hardcode `strokeWeight`; always `setBoundVariable('strokeWeight', borderWidthVar)`.

### Component properties — map to code props

Figma component properties must map 1:1 to code props for Code Connect:

| Figma property | Type | Code prop |
|---|---|---|
| `variant` | VARIANT | `variant` |
| `size` | VARIANT | `size` |
| `state` | VARIANT | `disabled` / `loading` / `danger` (mapped in CC) |
| `label` | TEXT | `children` |
| `show-left-icon` | BOOLEAN | presence of `iconLeft` |
| `icon-left` | INSTANCE_SWAP | `iconLeft` string value |
| `show-right-icon` | BOOLEAN | presence of `iconRight` |
| `icon-right` | INSTANCE_SWAP | `iconRight` string value |

**Property naming**: use `show-*` (not `has-*`) for boolean visibility toggles.

**Property ordering**: related properties must be adjacent — never interleave unrelated properties between them.

Example correct order:
```
label          (TEXT)
show-left-icon (BOOLEAN)
icon-left      (INSTANCE_SWAP)
show-right-icon(BOOLEAN)
icon-right     (INSTANCE_SWAP)
```

### Loading state — hide all content slots

In the `state=loading` variant, hide every content slot via `opacity = 0` (not `visible = false`):
- Text label: `opacity = 0`
- `icon-left`: `opacity = 0`
- `icon-right`: `opacity = 0`

Using `opacity = 0` keeps nodes in the layout flow (preserving button width), mirroring `visibility: hidden` in code. Add a `ds-loader` instance (ABSOLUTE, CENTER constraints) on top.
