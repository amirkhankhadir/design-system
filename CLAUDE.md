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
- [ ] **Before writing any CSS number** — checked `dist/web/tokens.light.css` for an existing token. If missing, added it via `tokens/display.json` + `node build-tokens.js` first
- [ ] **Token semantic check** — every token used makes sense for its role (e.g. `color/text/*` → text fill only, `color/background/*` → surface fill only). If no fitting token exists → **discuss with user before creating** — do not silently reuse a wrong-category token
- [ ] **Typography** — used `ds-text-*` utility class in TSX (not manual `font-size`/`line-height`/`font-weight` in CSS)
- [ ] **Shadows** — used `ds-elevation-*` utility class in TSX (not manual `box-shadow` in CSS)
- [ ] All CSS values use semantic tokens — no hardcoded colors, sizes, radii, spacing, or font values
- [ ] Hover/active use the `::after` overlay pattern (not brightness or opacity tricks)
- [ ] Loading state: `disabled={disabled || loading}`, loader color chosen per bg type, content slots `opacity=0`
- [ ] Danger+disabled CSS block is at the bottom of the file
- [ ] `npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit` — all pass
- [ ] New component exported from `src/index.ts`
- [ ] Storybook: correct `title` grouping, Sizes story shows primary variant only, no standalone Danger/Loading/Focus stories
- [ ] Storybook stories have `decorators` with padding so tooltips/popovers have room to render

**Figma:**
- [ ] Page name, component name, and all property names are kebab-case
- [ ] **Page order** — before creating a new page: read all existing pages, sort component pages alphabetically, insert the new page in the correct alphabetical position (see rule below)
- [ ] All states present, hover/pressed overlays exist, loading shows `ds-loader`
- [ ] All visual properties bound to variables (fill, stroke, strokeWeight, radius, padding, gap, height)
- [ ] HUG width verified by screenshot (not just set in code)
- [ ] Loader/icon dependencies created before the component that uses them
- [ ] **Structural check on absolute children**: overlay at x=0,y=0 fills component; loader/centered elements at `(compW-childW)/2`. Always verify programmatically — screenshot alone is not enough
- [ ] **Pre-build behaviour analysis done** (see section below) — no structural decisions before answering all behaviour questions

---

### Post-component audit — run after every completed component

After finishing any component (code + Figma), run this full audit before moving on. Run steps 1-3 in parallel.

**1. Git**
```bash
git status          # must be clean (nothing uncommitted)
git log --oneline -5  # verify all expected commits are present
```

**2. Quality checks** (run from `packages/web/`)
```bash
npm run lint          # ESLint — must pass with 0 errors
npm run lint:css      # Stylelint — must pass with 0 errors
npm run format:check  # Prettier — must pass (fix with npm run format if not)
npx tsc --noEmit      # TypeScript — must pass with 0 errors
```

**3. Storybook build**
```bash
npm run build-storybook   # must complete with "build completed successfully"
```
The chunk size warning is acceptable — it is not an error.

**4. Figma visual check** (screenshot of the component set)
- All variants visible, no overflow, no missing arrows
- Resizing test: change `content` property to a long string — bubble must grow, arrow must stay pinned

**If any step fails → fix before starting the next component.**

---

### Pre-build behaviour analysis — required before writing any Figma component script

Before writing a single line of `use_figma` code for a component, answer these questions:

**1. What resizes, and in which direction?**
- Which nodes grow when content changes? (bubble, card, list...)
- Does it grow horizontally, vertically, or both?
- Is there a maximum size? → set `maxWidth` / `maxHeight` bound to a token

**2. What stays fixed while something else grows?**
- An arrow/caret that must stay pinned to an edge
- An icon that must stay at the center
- A label that must not stretch
→ These become `layoutPositioning = 'ABSOLUTE'` with `constraints` pinning to the right edge

**3. How does text behave?**
- Should it expand the container sideways? → `textAutoResize = 'WIDTH_AND_HEIGHT'`, `layoutSizingH = 'HUG'`
- Should it wrap and grow the container downward? → `textAutoResize = 'HEIGHT'`, `layoutSizingH = 'FILL'`
- Fixed size, clip overflow? → `textAutoResize = 'NONE'`

**4. What is the layout direction of each container?**
- Stacked vertically → `layoutMode = 'VERTICAL'`
- Side by side → `layoutMode = 'HORIZONTAL'`
- One floating element over another → outer frame with `layoutPositioning = 'ABSOLUTE'` on the floating child

**5. Where does the padding live?**
- Padding that belongs to the visual bubble → on the bubble frame
- Padding that reserves space for an arrow/badge/badge overlay → on the wrapper component frame, on the arrow's side

**6. What constraints does each absolutely-positioned child need?**
- Arrow below a growing bubble → `constraints.vertical = 'MAX'` (stays at bottom edge)
- Arrow above a growing bubble → `constraints.vertical = 'MIN'` (stays at top edge)
- Arrow to the right of a growing bubble → `constraints.horizontal = 'MAX'`
- Centered icon inside a growing frame → `constraints = { horizontal: 'CENTER', vertical: 'CENTER' }`

**Template — write this out before coding any new component:**
```
Component: [layout direction] [HUG/FILL/FIXED] × [HUG/FILL/FIXED]
  padding [side] = [value] — reserves space for [what]
  └── [child name]: [in-flow / ABSOLUTE]
        sizing: [HUG/FILL/FIXED] × [HUG/FILL/FIXED]
        text: textAutoResize=[HEIGHT/WIDTH_AND_HEIGHT/NONE]
        constraints (if ABSOLUTE): horizontal=[MIN/CENTER/MAX] vertical=[MIN/CENTER/MAX]
```

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

### 12. Hardcoded CSS values despite existing tokens and utility classes

**What happened:** Built the Tooltip component with hardcoded `font-weight: 600`, `font-weight: 400`, `box-shadow: 0 4px 8px rgba(...)`, `max-width: 240px`, `--arrow-size: 6px`, `10px`, `12px` — even though:
- `ds-text-small-1` / `ds-text-small-2` utility classes already existed and cover font-family + font-size + line-height + font-weight together
- `ds-elevation-2` utility class already existed with the exact same box-shadow values
- `--ds-spacing-*` tokens existed for 6px, 8px, 12px
- A new sizing token for 240px could be added to the system

**Why:** Wrote CSS from memory/habit instead of first auditing what the design system already provides. Violated the rule stated in the consistency checklist: "All CSS values use semantic tokens — no hardcoded colors, sizes, radii, or spacing."

**Rules:**
1. **Before writing any CSS value as a number**, check `dist/web/tokens.light.css` for an existing token. If the token doesn't exist, consult the user and add it via `tokens/display.json` or `tokens/semantics.json` + `node build-tokens.js`.
2. **Before writing typography CSS** (`font-size`, `line-height`, `font-weight`, `font-family`), check `dist/web/tokens.light.css` for `ds-text-*` utility classes. Apply those classes in TSX instead of repeating the values in CSS.
3. **Before writing `box-shadow`**, check `dist/web/tokens.light.css` for `ds-elevation-*` utility classes. Apply the matching class in TSX.
4. The "no hardcode" rule applies to every number in CSS — spacing, sizing, radius, colors, font values, shadow offsets. There are no exceptions.

---

### 13. Chose a JS-positioning library without verifying Storybook iframe compatibility

**What happened:** Built the Tooltip using `@floating-ui/react` with `strategy: 'absolute'` and `FloatingPortal`. The tooltip was consistently mis-positioned in Storybook — at (0,0), off-center, wrong size — requiring 6+ debugging iterations over multiple sessions before switching to pure CSS.

**Why:** Chose Floating UI based on its general quality without first checking whether JavaScript coordinate calculation works inside Storybook's nested iframes. Storybook docs renders each story in an `<iframe>` with its own `document`. `FloatingPortal` portaled to the parent page's `document.body`, not the iframe's, breaking all coordinate math.

**Rules:**
1. **Before adding any JS-based positioning library**, ask: does this component's positioning need to handle viewport boundaries, scroll containers, or dynamic flipping? If the answer is "for basic placement, no" — use **pure CSS** (`position: absolute` + `left: 50%; transform: translateX(-50%)` etc.). It works in every environment with zero dependencies.
2. **Pure CSS tooltip/popover positioning is the default.** Only reach for Floating UI when you genuinely need dynamic flip/shift (e.g., a dropdown that must avoid the viewport edge regardless of trigger position).
3. **Storybook iframes break JavaScript coordinate systems.** Avoid `FloatingPortal`, `document.body` portals, and `getBoundingClientRect()`-based math in components that must work in Storybook docs.

---

### 14. Used hardcoded value instead of creating a missing token

**What happened:** `max-width: 240px` was needed for the Tooltip. No `--ds-sizing-240` token existed. Instead of creating the token, wrote `240px` directly in CSS and left a comment "no token exists."

**Why:** Wanted to avoid touching the token files, so took the shortcut of hardcoding.

**Rule:** If a CSS value has no matching token, **create the token** — don't hardcode. All 4 steps are mandatory:
1. Add the primitive to `tokens/primitives.json` → `dimensions` scale (if not already there)
2. Add the semantic token to `tokens/display.json` → appropriate group (`sizing`, `spacing`, etc.) with `$comment` explaining usage
3. Run `node build-tokens.js` at the repo root — all outputs (`tokens.light.css`, `tokens.dark.css`, iOS, Android) update automatically
4. **Create the same variables in Figma** via `use_figma`: primitive in `global-primitives` (scopes `[]`), semantic in `display-semantics` aliased to the primitive with the correct scope (`WIDTH_HEIGHT` for sizing, `GAP` for spacing, etc.)
5. Use the new `var(--ds-sizing-...)` in CSS

Never leave a `/* no token exists */` comment and a hardcoded value — that's always a TODO that should be done immediately. And never add a token to code without adding it to Figma in the same step.

---

### 15. Built fewer Figma variants than exist in code without asking

**What happened:** The Tooltip code has 12 placements (`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`). I built only 4 placement variants in Figma (top, bottom, left, right), silently dropping the `-start` / `-end` variants without asking.

**Why:** Assumed a simplified set would be acceptable to avoid 24 variants. Did not verify against the code props.

**Rule:** Before building a Figma component, always count and list the exact variant axes from the code props. **Build all variants that exist in code** — each `-start`/`-end` placement is visually distinct (arrow shifts position) and designers need to see and choose between them. Silently reducing variants means designers don't know those values exist. If the matrix is very large (>50), ask the user explicitly before simplifying.

---

### 16. Duplicate/conflicting component properties in Figma

**What happened:** Added a BOOLEAN component property `show-title` to the Tooltip component set — but `show-title` already existed as a VARIANT property (diamond icon). This created two conflicting `show-title` entries in the Properties panel.

**Why:** Did not check existing variant property names before calling `addComponentProperty`.

**Rule:** Before calling `addComponentProperty(name, ...)`, always inspect `compSet.componentPropertyDefinitions` AND the variant property names (from child component names, e.g. `placement=top, show-title=true`). If any name from `addComponentProperty` matches an existing variant key — **do not add it**. Component properties must have names that do not conflict with variant property keys.

```js
// Always check before adding
const existingKeys = Object.keys(compSet.componentPropertyDefinitions);
const variantKeys = [...new Set(
  compSet.children.flatMap(c => 
    c.name.split(', ').map(p => p.split('=')[0].trim())
  )
)];
const allExisting = new Set([...existingKeys, ...variantKeys]);
// Only add if name not already in allExisting
```

---

### 18. Wrong structure for "bubble + arrow" Figma components

**What happened:** Built the Tooltip component with a fixed-size outer wrapper and the arrow as a regular in-flow child. When text content changed:
- The wrapper didn't grow (fixed size)
- The arrow stayed at a hardcoded y position instead of tracking the bubble edge
- The content text expanded the bubble *sideways* instead of wrapping

**Root cause:** Did not understand the correct Figma pattern for components that contain a floating element (arrow/caret) anchored to a resizable container.

**Rule — correct "bubble + arrow" architecture:**

```
Component wrapper  (auto-layout: VERTICAL or HORIZONTAL depending on placement)
  layoutSizingH / V = HUG
  padding on the arrow side = arrow thickness (e.g. paddingBottom=6 for top placement)
  → This reserves space for the arrow without adding it to the layout flow

  bubble  (first in-flow child, auto-layout VERTICAL)
    layoutSizingH = HUG, layoutSizingV = HUG
    maxWidth bound to sizing token

    content TEXT  (FILL × HUG, textAutoResize = 'HEIGHT')
      → FILL: fills bubble width, causing text to wrap
      → textAutoResize HEIGHT: width is fixed, height grows with wrapped text

  arrow VECTOR  (layoutPositioning = 'ABSOLUTE')
    → Sits in the padding zone — NOT in the auto-layout flow
    constraints.vertical/horizontal = MAX on the arrow side
      → Stays pinned to the edge as bubble grows
```

**Placement → layout direction + padding side:**
| Placement group | comp.layoutMode | padding side | arrow constraints |
|---|---|---|---|
| `top` | VERTICAL | paddingBottom | vertical=MAX |
| `bottom` | VERTICAL | paddingTop | vertical=MIN |
| `left` | HORIZONTAL | paddingRight | horizontal=MAX |
| `right` | HORIZONTAL | paddingLeft | horizontal=MIN |

**Arrow horizontal position within the padding zone (top/bottom):**
- `center`: ax = (bubbleW - arrowW) / 2, constraints.horizontal = CENTER
- `start`: ax = 12 (ds-spacing-12), constraints.horizontal = MIN
- `end`: ax = bubbleW - 12 - arrowW, constraints.horizontal = MAX

**Arrow vertical position (left/right):**
- `center`: ay = (bubbleH - arrowH) / 2, constraints.vertical = CENTER
- `start`: ay = 8 (ds-spacing-8), constraints.vertical = MIN
- `end`: ay = bubbleH - 8 - arrowH, constraints.vertical = MAX

---

### 17. Created Figma frames with fixed size instead of HUG + maxWidth

**What happened:** Built Tooltip `bubble` frames with a hardcoded fixed width (e.g. `92px`). When the designer changes the `content` text property to a longer string, the bubble stays at `92px` and the text overflows — the frame doesn't resize. Also forgot to set `maxWidth` matching the CSS `max-width` constraint.

**Why:** Used `figma.createFrame()` + `resize(w, h)` instead of auto-layout with HUG. `resize()` sets a fixed size that doesn't respond to content changes. Also did not think to carry over the CSS `max-width` constraint into Figma.

**Rule:** Any Figma frame whose size should follow its text content **must** use auto-layout with HUG:
```js
bubble.layoutMode = 'VERTICAL';          // or HORIZONTAL
bubble.primaryAxisSizingMode = 'AUTO';   // HUG
bubble.counterAxisSizingMode = 'AUTO';   // HUG
bubble.layoutSizingHorizontal = 'HUG';
bubble.layoutSizingVertical   = 'HUG';
```
**Always mirror CSS constraints in Figma:**
- CSS `max-width: var(--ds-sizing-240)` → `bubble.maxWidth = 240` + `bubble.setBoundVariable('maxWidth', sizingVar)`
- CSS `min-width` → `bubble.minWidth`
- CSS `min-height` → `bubble.minHeight`

Bind the value to the design variable when the token exists, not just set the raw number.

---

### 19. Added Figma pages in wrong order instead of alphabetical

**What happened:** New component pages (e.g. `tooltip`) were appended at the end of the page list without checking where they belong alphabetically.

**Rule:** Before creating any new component page in Figma:
1. Read all existing pages: `figma.root.children.map(p => p.name)`
2. Identify the component pages (exclude separators like `---`)
3. Determine where the new page fits alphabetically
4. Create the page and move it to the correct index with `figma.root.insertChild(index, page)`

**Current page order** (as of last update):
```
0  buttons
1  icon-button
2  loader
3  tooltip
4  ---
5  icons
```

**Script pattern:**
```js
const newPage = figma.createPage();
newPage.name = 'checkbox'; // example

// Find correct insertion index (alphabetical, before ---)
const pages = figma.root.children;
const separatorIdx = pages.findIndex(p => p.name === '---');
const componentPages = pages.slice(0, separatorIdx);
const insertAt = componentPages.findIndex(p => p.name > newPage.name);
const finalIdx = insertAt === -1 ? separatorIdx : insertAt;
figma.root.insertChild(finalIdx, newPage);
```

---

### 8. Removed package without removing it from Storybook addons
**What happened:** Uninstalled `@chromatic-com/storybook` from `package.json` but left it in `.storybook/main.ts` addons list. This would break `storybook build` with "Cannot find module" error.
**Rule:** When removing a Storybook addon package, always update `.storybook/main.ts` at the same time. The two files must stay in sync.

---

## Tokens

- **Never add new tokens without consulting the user first.**
- Use only semantic tokens (`--ds-color-*`, `--ds-spacing-*`, `--ds-radius-*`, `--ds-sizing-*`) — never primitives, never hardcoded values.
- Tokens live in `tokens/semantics.json` → built via `build-tokens.js` → output `dist/web/tokens.light.css` + `tokens.dark.css`.

### Token sync rule — code AND Figma, always together

**Tokens must exist in both places simultaneously.** The token system has two parallel sources of truth:

| Layer | File | How to add |
|---|---|---|
| Code | `tokens/primitives.json` + `tokens/display.json` (or `semantics.json`) | Edit JSON → `node build-tokens.js` |
| Figma | `global-primitives` + `display-semantics` (or `brand-theme-semantics`) | `use_figma` script |

**Adding a new token = 4 steps, always all 4:**
1. Add primitive value to `tokens/primitives.json` → `dimensions` (or `colors`, etc.)
2. Add semantic variable to `tokens/display.json` (or `semantics.json`) with `$alias`, `$value`, `$comment`
3. Run `node build-tokens.js` — regenerates all CSS/iOS/Android outputs
4. Create the same two variables in Figma via `use_figma`: primitive in `global-primitives` (scopes `[]`), semantic in `display-semantics` / `brand-theme-semantics` (correct scope e.g. `WIDTH_HEIGHT`, `FRAME_FILL`, etc.), aliased to the primitive

**Never do step 3 without step 4.** A token that exists in code but not in Figma breaks designer–developer parity and will be missing when Figma components need to bind to it.

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
