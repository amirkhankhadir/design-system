# Known Mistakes — Self-Documented

Each entry: what went wrong, why, and the correct behaviour. Add every new one here.

---

### 30. `:checked` selector outranked `--disabled` modifier, leaking brand color into disabled+selected state

**What happened:** Radio's checked-border rule was `.radio__input:checked ~ .radio__circle { border-color: var(--ds-color-brand-default); }` — specificity (0,3,0) (2 classes + 1 pseudo-class). The disabled override was `.radio--disabled .radio__circle { border-color: var(--ds-color-border-subtle); }` — specificity (0,2,0). Lower specificity loses regardless of source order, so a disabled+checked radio kept the blue brand border instead of the muted disabled border.

**Why:** Checkbox avoided this because its checked rule sets `background` (which the disabled rule also overrides at equal specificity (0,2,0) — both targeting `.checkbox__box` directly, no pseudo-class tipping the scale). Radio's checked rule targets the border via a `:checked` pseudo-class on a sibling selector, adding specificity the disabled rule didn't anticipate.

**Rule:** When a state modifier (`:checked`, `:hover`, `:focus`) and a top-level modifier class (`--disabled`, `--error`) can both apply to the same element, explicitly write the combined selector (`.radio--disabled .radio__input:checked ~ .radio__circle`) rather than assuming the modifier class alone will win. Don't rely on "disabled is always last in the file" — specificity beats source order every time pseudo-classes are involved.

---

### 29. Setting `color` on BooleanControl `<label>` breaks the active span in dark mode

**What happened:** DARK_OVERRIDE had `.docblock-argstable label { color: var(--ds-color-text-primary) !important }`. In dark mode `--ds-color-text-primary` is white/light. Storybook's BooleanControl renders as `<label><input><span>False</span><span>True</span></label>` — the active span gets a white background via Storybook's CSS. The child spans inherit the label's `color`, so the active span ends up white-text-on-white-background: invisible.

**Root cause:** CSS `color` is inherited. Setting it on a container affects all descendants, including those that receive a contrasting background.

**Rule:** Never set `color` on `.docblock-argstable label` in DARK_OVERRIDE. Handle the toggle spans explicitly:
```css
/* Active span always has white bg — hardcode dark text */
.docblock-argstable label input:not(:checked) ~ span:first-of-type,
.docblock-argstable label input:checked ~ span:last-of-type {
  color: #1f2328 !important;
}
/* Inactive span on dark bg — use light token */
.docblock-argstable label input:checked ~ span:first-of-type,
.docblock-argstable label input:not(:checked) ~ span:last-of-type {
  color: var(--ds-color-text-secondary) !important;
}
```

---

### 28. Created component stories without `tags: ['autodocs']` — no Docs page in Storybook

**What happened:** Checkbox.stories.tsx was written without `tags: ['autodocs']` and without a `Default` story with `args`. Result: Storybook showed only individual stories (All States, Interactive, Group) with no generated Docs page — component appeared undocumented in the sidebar.

**Rule:** Every new component stories file must include, from the start:
1. `tags: ['autodocs']` in the meta object — generates the Docs tab
2. `argTypes` block with a description for every prop
3. A `Default` story with `args` — gives the Docs page an interactive canvas

Without these, the component has no documentation page. Add them when creating the file, not as an afterthought.

---

### 27. Conditional SVG rendering in custom checkbox creates split state between CSS and React

**What happened:** In `Checkbox.tsx`, the SVG icon was rendered conditionally — `{(checked || indeterminate) && <svg ...>}`. Clicking an uncontrolled checkbox changed the native `<input>`'s state, so the CSS `:checked` selector fired and turned the box blue, but the React prop `checked` stayed `undefined`, so the SVG was never mounted. Result: blue box without a checkmark.

**Why:** Two parallel state sources controlled the same visual: CSS (reads native DOM) and React conditional rendering (reads prop). For uncontrolled usage they diverge — CSS updates immediately, React doesn't re-render because no prop changed.

**Rule:** In a custom-styled checkbox (hidden native input + custom visual box), always render all icon variants unconditionally in the DOM and control their visibility purely via CSS selectors. Never use React conditional rendering for states that CSS already tracks.

**Correct pattern:**
```tsx
{/* Always in DOM — CSS shows the right one */}
<svg className="checkbox__icon checkbox__icon--check" ...>
  <path d="M2 6L4.5 8.5L10 3" ... />
</svg>
<svg className="checkbox__icon checkbox__icon--dash" ...>
  <path d="M2.5 6H9.5" ... />
</svg>
```
```css
.checkbox__icon { display: none; }
.checkbox__input:checked ~ .checkbox__box .checkbox__icon--check { display: block; }
.checkbox--indeterminate .checkbox__box .checkbox__icon--check  { display: none; }
.checkbox--indeterminate .checkbox__box .checkbox__icon--dash   { display: block; }
```

**Applies to:** any component where a hidden native input drives CSS pseudo-class state (`:checked`, `:disabled`, `:focus-visible`) while a custom visual element displays the result.

---

### 26. `.sbdocs p` / `.sbdocs-content p` selectors in DARK_OVERRIDE reach story canvas

**What happened:** Added `.sbdocs p, .sbdocs li, .sbdocs span` and `.sbdocs-content p` to DARK_OVERRIDE to fix invisible description text in dark docs. These selectors matched `p` elements inside `.docs-story` (the story canvas), including `.tooltip__content p`. Result: `color: var(--ds-color-text-primary) !important` (light in dark mode) was applied to tooltip text, making it invisible on the light `background-inverse` tooltip background.

**Why:** `.docs-story` is a descendant of `.sbdocs-content` in Storybook's DOM — broad tag selectors leak straight into rendered components.

**Rule:** Never use bare tag selectors (p, li, span, a) scoped only to `.sbdocs` or `.sbdocs-content` in DARK_OVERRIDE. Only use Storybook's own CSS-module class names (always PascalCase, never kebab-case) — e.g. `[class*="Markdown"]`, `[class*="DocsContent"]`, `[class*="Description"]`. These never appear in our component markup which uses BEM kebab-case.

**Safe pattern:**
```css
/* ✅ PascalCase CSS-module classes — never match component elements */
[class*="DocsContent"] p, [class*="Markdown"] p, [class*="Description"] p { ... }

/* ❌ Too broad — leaks into story canvas */
.sbdocs p, .sbdocs-content p, .sbdocs span { ... }
```

---

### 25. Making changes when the user asked a question

**What happened:** User said "у нас нейминг не бьётся, ты бы сделал консистентно?" — это был вопрос для обсуждения. Claude сразу полез в Figma и переименовал коллекции без подтверждения.

**Why:** Вопросительная формулировка ("имело ли это смысл", "ты бы сделал...") воспринималась как команда.

**Rule:** Если пользователь задаёт вопрос или высказывает наблюдение — сначала обсуди, потом предложи план, потом жди явного "да, делай". Особенно когда речь о переименовании/реструктуризации — это необратимые изменения с последствиями.

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

### 24. Moving or removing a story export without verifying downstream impact

**What happened:** Removed the `Elevation` export from `Typography.stories.tsx` and created a new `Elevation.stories.tsx` — reported it as done after only running `tsc` and `format:check`. Did not check for imports or run a full build.

**Why it matters:** Other files could import named exports from story files. CSS utility classes used in the moved story could theoretically break if the file structure changed unexpectedly. A full build is the only way to confirm nothing broke.

**Rule:** After moving, renaming, or deleting any export from a story file, always run all three:
1. `grep -r "from.*FileName.stories"` — check for imports of that file
2. `npx tsc --noEmit` — TypeScript errors
3. `npm run build-storybook` — full build confirms Storybook is intact

Never report a move/delete as done without the full build passing.

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

### 21. Never set fills, colors, spacing, or styles directly on instance child nodes

**Core rule:** Setting any visual property (fill, stroke, corner radius, padding, text style) directly on a node that lives inside a Figma instance creates an **instance override**. Overrides sever the connection to the main component — future changes to the component will not propagate to those instances.

**The only safe "override" is using a component's exposed properties** (INSTANCE_SWAP, TEXT, BOOLEAN via `setProperties`). These are intended entry points. Anything else is a broken link.

---

**What happened (concrete example):** Swapped icon on `primary` doc instances using `setProperties({'icon#238:0': sameDefaultId})`. This caused the icon fill to reset to `icon-default` (wrong). The "fix" attempt then manually set `vector.fills = [...]` — which added an override on a nested node. Both the broken fill AND the manual fix created overrides. Main component lost control of those instances.

**Why `setProperties` with the same default breaks things:** When `setProperties` is called with the component's own default value, Figma performs a no-op swap that can drop fill overrides the variant had placed on the nested icon. Swapping to a *different* component than the default preserves those overrides correctly.

---

**Rules:**

1. **Never set `fills`, `strokes`, `cornerRadius`, `padding`, `textStyleId`, or any other visual property on a node inside an instance.** If a visual property is wrong on an instance, the fix is always to fix the main component or recreate the instance — never to patch the instance directly.

2. **Never call `setProperties` when the icon is already the component's default value.** Check first:
   ```js
   const currentIconId = inst.componentProperties['icon#238:0'].value;
   if (currentIconId !== newIconId) {
     inst.setProperties({ 'icon#238:0': newIconId });
   }
   // if currentIconId === newIconId → do nothing, the component controls the fill
   ```

3. **If an instance has incorrect fills due to a bad swap, recreate it fresh — do not patch fills:**
   ```js
   const parent = inst.parent;
   const index  = parent.children.indexOf(inst);
   const fresh  = comp.createInstance();       // zero overrides
   parent.insertChild(index, fresh);
   inst.remove();
   // Do NOT call setProperties if icon equals the component default
   ```

4. **After any batch of icon swaps, audit for overrides:**
   ```js
   for (const inst of allInstances) {
     const srcVarId  = inst.mainComponent.findOne(n => n.type === 'VECTOR')?.fills[0]?.boundVariables?.color?.id;
     const instVarId = inst.findOne(n => n.type === 'VECTOR')?.fills[0]?.boundVariables?.color?.id;
     if (srcVarId !== instVarId) console.error('override detected on', inst.id);
   }
   ```

**Variants where fill ≠ `icon-default` (require extra care):**
| Variant | Icon fill |
|---|---|
| `primary` | `color/icon/on-brand` (VariableID:125:12) |
| `link` | `color/brand/default` (VariableID:125:17) |
| `secondary`, `tertiary`, `ghost` | `icon-default` / `icon-secondary` — no risk |

---

### 23. `editComponentProperty` with any argument strips VARIANT key from all child names

**What happened:** Called `compSet.editComponentProperty('variant', {})` with an empty object to test API support. This silently removed the `variant=` key prefix from all 90 child component names — turning `variant=primary, size=sm, state=default` into `=primary, size=sm, state=default`. Figma immediately showed "Some layers have invalid names" error and `componentPropertyDefinitions` became unreadable.

**Why:** `editComponentProperty` on a VARIANT-type property is destructive even with an empty object. VARIANT properties are defined implicitly by child component names — calling `editComponentProperty` on them resets the property definition and strips the key from all children.

**Fix applied:**
```js
for (const child of cs.children) {
  if (child.name.startsWith('=')) {
    child.name = 'variant' + child.name; // restore stripped prefix
  }
}
```

**Rules:**
1. **Never call `editComponentProperty` on a VARIANT-type property.** VARIANT properties are owned by child names, not by the property definition object. There is no safe way to edit them via this API.
2. **Never call `editComponentProperty` with an empty object `{}` to "test" it.** Even an empty call is destructive on VARIANT properties.
3. **Only call `editComponentProperty` on TEXT, BOOLEAN, or INSTANCE_SWAP properties** — and only when you need to rename the property or change `defaultValue` / `preferredValues`.
4. **Component property descriptions for VARIANT properties must be set manually in the Figma UI.** The Plugin API cannot safely touch them.

**Safe usage of `editComponentProperty`:**
```js
// ✅ Rename an INSTANCE_SWAP property
compSet.editComponentProperty('icon#238:0', { name: 'icon' });

// ✅ Set preferred values on INSTANCE_SWAP
compSet.editComponentProperty('icon#238:0', { preferredValues: [...] });

// ✅ Change default value of a TEXT property
compSet.editComponentProperty('label#203:0', { defaultValue: 'Button' });

// ❌ Never touch VARIANT properties via this API
compSet.editComponentProperty('variant', {}); // destroys all child names
compSet.editComponentProperty('size', { description: '...' }); // same result
```

---

### 22. Focus ring invisible on transparent-background instances

**What happened:** Applied `focus-ring` effect style (DROP_SHADOW) to a `ghost` or `secondary` icon-button instance. The ring was invisible in Figma — the shadow rendered but wasn't visible against the transparent/white background.

**Why:** Figma DROP_SHADOW effects require the node to have a visible fill for the shadow spread to appear clearly. Ghost and some secondary variants have no background fill — the ring blends into the canvas.

**Rule:** When demonstrating focus rings in documentation, always use a variant that has a solid background fill (e.g. `primary`). The focus ring effect is visually meaningful only on elements with a contrasting fill.

---

### 20. Overlay layer left unlocked, blocking content selection
**What happened:** `overlay` rectangle on top blocked all clicks — impossible to select content layers beneath it.
**Rule:** Every `overlay` node must be locked immediately after creation: `overlay.locked = true`
**Verification:**
```js
const unlocked = compSet.findAll(n => n.name === 'overlay' && !n.locked);
// must return []
```
