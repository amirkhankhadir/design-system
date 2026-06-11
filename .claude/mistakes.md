# Known Mistakes — Self-Documented

Each entry: what went wrong, why, and the correct behaviour. Add every new one here.

---

### 1. Claiming HUG width was applied when it wasn't
**What happened:** Set `primaryAxisSizingMode = 'AUTO'` in the script, reported it as done. Figma still showed fixed width. User had to fix manually.
**Why:** The code ran without error but the property wasn't actually taking effect — didn't verify with a screenshot or metadata check.
**Rule:** After setting any sizing mode, always screenshot and check `width` in the returned metadata. Never report "done" without visual or data confirmation.

---

### 2. Silently skipping a dependency instead of flagging it
**What happened:** Built Button's `state=loading` without a Loader component in Figma. Loading looked identical to Disabled — no spinner was shown.
**Rule:** Before building any component state that references another component, check if that component exists in Figma. If not — stop, say so explicitly, and ask whether to build the dependency first.

---

### 3. Loader built with fill+innerRadius instead of stroke
**What happened:** Used `arcData` with `innerRadius=0.6` and a FILL to simulate the spinner ring. Looked like a thick donut wedge — nothing like the SVG spinner in Storybook.
**Why:** Didn't read the actual `Loader.tsx` / `Loader.css` code before building the Figma component.
**Rule:** Before building any Figma component, read the real code implementation first. The Loader is two SVG `<circle>` elements with `stroke` only (no fill): a full-circle track at `opacity: 0.16` and a 75% arc with `stroke-linecap: round`. Replicate stroke mechanics, not fill mechanics.

---

### 4. Figma vectorPaths does not support the `A` (arc) SVG command
**What happened:** Tried to use `M x y A rx ry ... ex ey` in `vectorPaths.data`. Figma threw "Invalid command at A".
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

### 8. Removed package without removing it from Storybook addons
**What happened:** Uninstalled `@chromatic-com/storybook` from `package.json` but left it in `.storybook/main.ts` addons list. Breaks `storybook build` with "Cannot find module".
**Rule:** When removing a Storybook addon package, always update `.storybook/main.ts` at the same time. The two files must stay in sync.

---

### 9. Added Node.js file to `src/` without updating tsconfig
**What happened:** Created `src/vite-plugin-material-icons.ts` using `node:path`, `node:fs`, `node:url`. TypeScript threw `Cannot find module 'node:path'` because `tsconfig.json` didn't include `"types": ["node"]`.
**Rule:** Any file in `src/` that uses Node.js built-ins needs `@types/node` installed and `"types": ["node"]` in `tsconfig.json`.

---

### 10. Broad `[class*="..."]` selectors in DARK_OVERRIDE catching component classes
**What happened:** `DARK_OVERRIDE` in `preview.tsx` had `[class*="label"]` and `[class*="secondary"]` selectors. These accidentally matched `span.btn__label` and `.btn--secondary`, applying wrong colors.
**Why:** CSS substring attribute selectors `[class*="foo"]` match ANY element whose class contains that substring.
**Rule:** Never use lowercase substring attribute selectors broadly in Storybook overrides. Storybook's own CSS module class names use PascalCase (e.g., `StoriesHeader`, `GroupTitle`) — use those exclusively. For argstable-specific overrides, always scope with `.docblock-argstable [class*="..."]`.

---

### 11. Absolute child nodes (overlay, loader) at wrong positions after component creation
**What happened:** 90 icon-button variants built and screenshot-verified as "done". `overlay` rectangles were at x=-30, y=-38 (should be x=0, y=0) and `loader` instances were off-center. Screenshots at 0.5x scale didn't reveal this.

**Rule:** After building any Figma component with ABSOLUTE child nodes, always run a programmatic structural check:
- **Overlay**: must have `x === 0`, `y === 0`, `width === comp.width`, `height === comp.height`
- **Centered elements**: must have `x === (comp.width - child.width) / 2`, `y === (comp.height - child.height) / 2`

```js
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

Screenshot alone is **insufficient** for layout precision.

---

### 12. Hardcoded CSS values despite existing tokens and utility classes
**What happened:** Built the Tooltip with hardcoded `font-weight: 600`, `box-shadow: 0 4px 8px rgba(...)`, `max-width: 240px` — even though `ds-text-*`, `ds-elevation-*`, and `--ds-spacing-*` already existed.
**Rules:**
1. Before writing any CSS number → check `dist/web/tokens.light.css` for an existing token
2. Before writing typography CSS → check for `ds-text-*` utility classes
3. Before writing `box-shadow` → check for `ds-elevation-*` utility classes
4. No exceptions — every number in CSS must use a token

---

### 13. Chose a JS-positioning library without verifying Storybook iframe compatibility
**What happened:** Built Tooltip using `@floating-ui/react` with `FloatingPortal`. Consistently mis-positioned in Storybook — requiring 6+ debug iterations before switching to pure CSS.
**Why:** Storybook docs renders stories in an `<iframe>`. `FloatingPortal` portaled to the parent page's `document.body`, breaking all coordinate math.
**Rules:**
1. Default to **pure CSS** positioning. Only use Floating UI when genuinely needed (viewport-aware flip/shift for dropdowns).
2. **Storybook iframes break JavaScript coordinate systems.** Avoid `FloatingPortal`, `document.body` portals, and `getBoundingClientRect()`-based math.

---

### 14. Used hardcoded value instead of creating a missing token
**What happened:** `max-width: 240px` needed. No token existed. Wrote `240px` directly with a comment "no token exists."
**Rule:** If a value has no matching token, **create the token** — don't hardcode. All 4 steps mandatory:
1. Add primitive to `tokens/primitives.json`
2. Add semantic token to `tokens/display.json` with `$comment`
3. Run `node build-tokens.js`
4. Create same variables in Figma via `use_figma`

Never leave a `/* no token exists */` comment. And never add a token to code without adding it to Figma in the same step.

---

### 15. Built fewer Figma variants than exist in code without asking
**What happened:** Tooltip has 12 placements in code. Built only 4 in Figma (silently dropped `-start`/`-end` variants).
**Rule:** Always count and list exact variant axes from code props. Build ALL variants that exist in code. If matrix > 50, ask the user before simplifying.

---

### 16. Duplicate/conflicting component properties in Figma
**What happened:** Added BOOLEAN property `show-title` via `addComponentProperty` — but it already existed as a VARIANT property. Created two conflicting entries.
**Rule:** Before calling `addComponentProperty(name, ...)`, always check both `compSet.componentPropertyDefinitions` AND variant property names from child component names.

```js
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

### 17. Created Figma frames with fixed size instead of HUG + maxWidth
**What happened:** Built Tooltip `bubble` frames with hardcoded fixed width. Text overflowed when content changed.
**Rule:** Any Figma frame whose size should follow its text content must use auto-layout with HUG:
```js
bubble.layoutMode = 'VERTICAL';
bubble.primaryAxisSizingMode = 'AUTO';
bubble.counterAxisSizingMode = 'AUTO';
bubble.layoutSizingHorizontal = 'HUG';
bubble.layoutSizingVertical   = 'HUG';
```
Always mirror CSS constraints in Figma: `max-width`, `min-width`, `min-height` — bind to design variables, not raw numbers.

---

### 18. Wrong structure for "bubble + arrow" Figma components
**What happened:** Arrow as in-flow child. When text changed, wrapper didn't grow and arrow stayed at hardcoded position.
**Rule — correct "bubble + arrow" architecture:**
```
Component wrapper  (auto-layout: VERTICAL or HORIZONTAL)
  padding on arrow side = arrow thickness  ← reserves space without adding to flow
  bubble  (first in-flow child, auto-layout VERTICAL, HUG × HUG, maxWidth bound to token)
    content TEXT  (FILL × HUG, textAutoResize = 'HEIGHT')
  arrow VECTOR  (layoutPositioning = 'ABSOLUTE', constraints pinned to arrow side)
```

| Placement | layoutMode | padding side | arrow constraints |
|---|---|---|---|
| `top` | VERTICAL | paddingBottom | vertical=MAX |
| `bottom` | VERTICAL | paddingTop | vertical=MIN |
| `left` | HORIZONTAL | paddingRight | horizontal=MAX |
| `right` | HORIZONTAL | paddingLeft | horizontal=MIN |

---

### 19. Added Figma pages in wrong order instead of alphabetical
**What happened:** New component pages appended at end without checking alphabetical order.
**Rule:** Before creating any new component page:
1. Read all existing pages
2. Exclude separators (`---`)
3. Insert at correct alphabetical position with `figma.root.insertChild(index, page)`

**Current page order:** `buttons → icon-button → loader → tooltip → --- → icons`

---

### 20. Overlay layer left unlocked, blocking content selection
**What happened:** `overlay` rectangle on top blocked all clicks — impossible to select content layers beneath it.
**Rule:** Every `overlay` node must be locked immediately after creation: `overlay.locked = true`
**Verification:**
```js
const unlocked = compSet.findAll(n => n.name === 'overlay' && !n.locked);
// must return []
```
