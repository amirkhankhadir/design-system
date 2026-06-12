# Figma Component Patterns

## Descriptions — required on every new entity

Every new Figma entity must have a `description` set at creation time. Descriptions surface in the Figma UI without opening documentation and are the first thing a designer reads.

| Entity | API | Where it appears |
|---|---|---|
| Component set | `compSet.description = '...'` | Component Picker panel on hover/insert |
| Effect style | `style.description = '...'` | Styles panel tooltip |
| Text style | `style.description = '...'` | Styles panel tooltip |
| Variable | `variable.description = '...'` | Variable picker tooltip |

**Component property descriptions** (variant, size, state…) cannot be set via the Plugin API — add them manually in Figma UI after creation.

### Formatting — plain text only, structure via line breaks

**Markdown does NOT render** when set via the Plugin API (`node.description = '...'`). Bold/italic only work when applied through Figma's UI toolbar. Never use `**`, `_`, `#`, `-` list syntax in descriptions — they show as raw characters.

Structure using blank lines (`\n\n`) and plain prose instead.

**Component set formula:**
```js
node.description =
`{One-line summary.}

{variant} — {when to use}.
{variant} — {when to use}.

{Key constraint in plain text — no markdown.}`;
```

**Effect style formula:**
```js
style.description = '{Shadow name} ({size in px}).\n\nUse for {comma-separated contexts}.\n\nCSS: ds-elevation-N';
```

**Icon component formula:**
```js
comp.description = `Material Symbol: ${name}\n${usageNote}\n\nAlso known as: ${tags.join(', ')}`;
```

**General rules:**
- Max 3 blocks separated by blank lines
- First line = what it is (no label needed, it's obvious from context)
- Second block = when to use
- Third block = constraint / aliases / CSS equivalent
- No bullet dashes, no markdown, no special characters

### Stay consistent with Storybook

Component descriptions must match `parameters.docs.description.component` in the `.stories.tsx` file. Read it before writing — never paraphrase from memory.

---

## Naming — all kebab-case, matching code

| Thing | Example |
|---|---|
| Page names | `buttons`, `icon-button`, `icons`, `loader` |
| Component set name | `button`, `icon-button` |
| Variant property keys | `variant`, `size`, `state` |
| Variant values | `primary`, `sm`, `default` |
| Component property names | `label`, `show-left-icon`, `icon-left` |

Never use TitleCase, camelCase, or spaces in Figma naming.

## States — always include interaction states

Every interactive component must include:
`default | hover | pressed | disabled | loading | danger`

- **hover**: overlay frame filled with `color/surface/1` (ABSOLUTE, STRETCH constraints)
- **pressed**: overlay frame filled with `color/surface/2` (ABSOLUTE, STRETCH constraints)
- Mirrors the `::after` overlay pattern used in code exactly.

## Sizing

- Interactive components: **HUG width** (`primaryAxisSizingMode = 'AUTO'`). Always verify with screenshot.
- Height: always **FIXED** (`counterAxisSizingMode = 'FIXED'`) bound to sizing token.

## Icons in Components

1. Create **icons page** first (if it doesn't exist)
2. Add icon slots as **instances** of icon components (not plain frames)
3. Add **`show-left-icon`** / **`show-right-icon`** BOOLEAN properties → linked to instance visibility
4. Add **`icon-left`** / **`icon-right`** INSTANCE_SWAP properties → linked to mainComponent
5. Icon sizes: **16px** (sm), **20px** (md/lg)

## Creating New Icon Components from Material Symbols

Source: `node_modules/@material-symbols/svg-400/outlined/<name>.svg`

All SVGs use `width="48" height="48" viewBox="0 -960 960 960"`. Change width/height to `"24"` when creating in Figma.

**Safe zone rule:** Material Symbols builds per-icon padding into the path coordinates. Preserve it by **never calling `vec.resize(24, 24)`** — let the natural SVG bounds stay.

| Icon | Safe zone | Visual weight |
|------|-----------|---------------|
| close | ~5.2px | light (simple ×) |
| add   | ~5.0px | light (simple +) |
| delete | ~4.0px | medium |
| edit  | ~3.0px | medium |
| settings | ~2.0px | heavy (dense gear) |

**Exact recipe:**
```js
// 1. Create frame from SVG (24×24, correct viewBox)
const svgFrame = figma.createNodeFromSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960"><path d="..."/></svg>`
);

// 2. Create 24×24 component
const comp = figma.createComponent();
comp.name = 'icon-name'; // kebab-case matching code
comp.resize(24, 24);
comp.fills = [];
comp.clipsContent = true;

// 3. Move vector — DO NOT resize it (safe zone lives here)
const vec = svgFrame.findAll(n => n.type === 'VECTOR')[0];
let fill = { type: 'SOLID', color: { r: 0.2706, g: 0.2706, b: 0.2706 } };
fill = figma.variables.setBoundVariableForPaint(fill, 'color', iconColorVar); // color/icon/default = VariableID:125:8
vec.fills = [fill];
vec.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
comp.appendChild(vec); // ← append, then DO NOT resize

// 4. Cleanup
svgFrame.remove();

// 5. Description with search tags — REQUIRED, do not skip
//    Fetch tags from: https://fonts.google.com/metadata/icons
//    Response has ")]}'" prefix — strip first 4 chars before JSON.parse
//    Structure: { icons: [{ name, tags: string[], categories: string[] }] }
const tags = /* tags from metadata for this icon name */;
const usageNote = /* one sentence: "Use for X, Y, Z actions." */;
comp.description = `Material Symbol: ${comp.name}. ${usageNote}\nSearch tags: ${tags.join(', ')}`;
```

**Fill variable:** `color/icon/default` = `VariableID:125:8`

**Why step 5 is mandatory:** Figma's Asset Panel searches only by component name — typing "trash" will never find the `delete` icon, "clear" will never find `close`. Tags in the description appear in the hover tooltip and act as a discoverable synonym list. Google uses the same metadata for fuzzy search on fonts.google.com.

Tags metadata URL (public, no auth): `https://fonts.google.com/metadata/icons`

## Dependencies — check before building

Before building any Figma component, check if it depends on another:
- Button Loading state → needs **Loader** component
- Any icon slot → needs **icons** page

**If dependency missing: stop, flag it explicitly, ask whether to build the dependency first.**

## Component Set Frame

Apply AFTER `combineAsVariants` (that call resets fills/strokes to defaults).

### Layout grid — 24px everywhere
```js
const GAP = 24, PAD = 24, CELL_W = 40; // CELL_W = largest variant width
comp.x = PAD + col * (CELL_W + GAP) + Math.round((CELL_W - comp.width) / 2);
compSet.resize(frameW, frameH);
```

### Background fill
```js
const bgVar = await figma.variables.getVariableByIdAsync('VariableID:71:76'); // color/background/default
let paint = { type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1 };
compSet.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', bgVar)];
```

### Purple dashed border
```js
compSet.strokes      = [{ type: 'SOLID', color: { r: 0.592, g: 0.278, b: 1.0 } }]; // #9747FF
compSet.strokeWeight = 2;
compSet.strokeAlign  = 'INSIDE';
compSet.dashPattern  = [10, 5];
```

## Token Bindings — bind everything

- Fill colors → `brand-theme-semantics` variables
- Stroke colors → same
- Corner radius → `display-semantics / radius/*`
- Padding → `display-semantics / spacing/*`
- Gap → `display-semantics / spacing/*`
- Height → `display-semantics / sizing/*`
- **Border width** → always `setBoundVariable('strokeWeight', borderWidthVar)`, never hardcode

## Component Properties — map to code props 1:1

| Figma property | Type | Code prop |
|---|---|---|
| `variant` | VARIANT | `variant` |
| `size` | VARIANT | `size` |
| `state` | VARIANT | `disabled` / `loading` / `danger` |
| `label` | TEXT | `children` |
| `show-left-icon` | BOOLEAN | presence of `iconLeft` |
| `icon-left` | INSTANCE_SWAP | `iconLeft` string value |

**Property naming**: `show-*` (not `has-*`) for boolean visibility.
**Property ordering**: related properties must be adjacent.

## Loading State — hide content via opacity

In `state=loading`, hide every content slot via `opacity = 0` (NOT `visible = false`):
- `opacity = 0` keeps nodes in layout flow → preserves component width
- Add `ds-loader` instance (ABSOLUTE, CENTER constraints) on top

## Overlay Layers

Every `overlay` node must be locked immediately after creation:
```js
overlay.locked = true;
```

## Page Order — alphabetical

Before creating a new component page:
1. Read all existing pages
2. Exclude separators (`---`)
3. Insert at correct alphabetical position: `figma.root.insertChild(index, page)`

**Current order:** `buttons → icon-button → loader → tooltip → --- → icons`

---

## Instance Override Rule (Critical)

**The single most important Figma rule.** Setting any visual property directly on a node inside an instance creates an override — severing the main component connection forever.

### What is safe
- `inst.setProperties({ 'icon#238:0': newIconId })` — INSTANCE_SWAP is an exposed entry point ✅
- `inst.effectStyleId = styleId` — applied to the instance itself (not a child node) ✅

### What is not safe
- `inst.findOne(n => n.type === 'VECTOR').fills = [...]` — override on child ❌
- `child.textStyleId = ...` — override on child ❌
- `child.fills`, `child.strokes`, `child.cornerRadius`, `child.padding` — all overrides ❌

### The `setProperties` same-value trap
Calling `setProperties` with the component's own **default** value triggers a no-op swap that can drop fill overrides the variant has on nested nodes (e.g. `icon-on-brand` on primary variant resets to `icon-default`).

```js
// Always guard before calling setProperties
const currentId = inst.componentProperties['icon#238:0'].value;
if (currentId !== newIconId) {
  inst.setProperties({ 'icon#238:0': newIconId });
}
// If already the default → do nothing
```

### If an instance has bad fills: recreate, don't patch
```js
const parent = inst.parent;
const index  = parent.children.indexOf(inst);
const fresh  = mainComp.createInstance(); // zero overrides
parent.insertChild(index, fresh);
inst.remove();
```

### Variants where icon fill ≠ icon-default (highest risk)
| Variant | Icon fill variable |
|---|---|
| `primary` | `color/icon/on-brand` (VariableID:125:12) |
| `link` | `color/brand/default` (VariableID:125:17) |
| secondary, tertiary, ghost | icon-default — safe |

### Post-swap audit
```js
for (const inst of allInstances) {
  const srcVar  = inst.mainComponent.findOne(n => n.type === 'VECTOR')?.fills[0]?.boundVariables?.color?.id;
  const instVar = inst.findOne(n => n.type === 'VECTOR')?.fills[0]?.boundVariables?.color?.id;
  if (srcVar !== instVar) console.error('OVERRIDE on', inst.id, inst.name);
}
```

---

## Effect Styles in Documentation (Focus Ring)

**Focus ring exists only as an effect style — not a component variant state.**

The focus ring is implemented in code via CSS `box-shadow: 0 0 0 2px background-default, 0 0 0 4px border-focus`. There is no `state=focused` in Figma component variants — intentional.

For documentation purposes, the `focus-ring` effect style (`S:522b85a120b1fe5afb5f45a5d197c3a6f2301c46`) can be applied to instances to illustrate keyboard focus behaviour.

### Critical: only use on instances with a solid background fill

DROP_SHADOW effects are **invisible on transparent-background elements** (ghost, link variants). The ring only renders visibly when the element has a contrasting fill.

✅ Use `primary` variant to demonstrate focus ring  
❌ Do not use `ghost`, `link`, or variants with `fills = []`

### Applying the style
```js
// Applied to the INSTANCE itself — not a child node
inst.effectStyleId = 'S:522b85a120b1fe5afb5f45a5d197c3a6f2301c46,';
```

### Parent clipping kills shadow visibility
If any ancestor frame has `clipsContent = true`, the 4px spread will be cut off:
```js
// Walk up the tree and disable clipping on all parents
let node = inst.parent;
while (node && node.type !== 'PAGE') {
  if (node.clipsContent) node.clipsContent = false;
  node = node.parent;
}
```

---

## screenshot() — Bounds, Overflow & Clipping

The `node.screenshot()` API crops to the **node's own bounding box**. Overflow effects (drop shadows, focus rings) outside that box are invisible in the image.

### To capture overflow effects
1. Screenshot from a **parent** node (or grandparent) that fully contains the shadow spread
2. Use `contentsOnly: false` to include sibling-node overlap
3. Ensure **all ancestor frames** have `clipsContent = false` — a single clipping ancestor kills the shadow

```js
// Bad — crops exactly to 32×32, shadow is cut off
await inst.screenshot({ scale: 3 });

// Better — screenshot the column containing the instance
await inst.parent.screenshot({ scale: 3, contentsOnly: false });
```

### `get_screenshot` vs `node.screenshot()`
`get_screenshot` renders via Figma's export pipeline (like File → Export) and DOES include overflow effects. Use it when you need to verify shadows/rings visually. `node.screenshot()` is faster but bounds-cropped.

---

## Pre-Build Behaviour Analysis

**Required before writing any `use_figma` code for a component.** Answer all questions before writing a single line.

### 1. What resizes, and in which direction?
- Which nodes grow when content changes?
- Max size? → set `maxWidth` / `maxHeight` bound to a token

### 2. What stays fixed while something else grows?
- Arrow/caret pinned to an edge → `layoutPositioning = 'ABSOLUTE'` with `constraints`

### 3. How does text behave?
- Expand container sideways → `textAutoResize = 'WIDTH_AND_HEIGHT'`, `layoutSizingH = 'HUG'`
- Wrap and grow downward → `textAutoResize = 'HEIGHT'`, `layoutSizingH = 'FILL'`
- Fixed, clip overflow → `textAutoResize = 'NONE'`

### 4. Layout direction of each container?
- Stacked vertically → `layoutMode = 'VERTICAL'`
- Side by side → `layoutMode = 'HORIZONTAL'`

### 5. Where does the padding live?
- Visual bubble padding → on the bubble frame
- Space for arrow → on the wrapper, on the arrow's side

### 6. Constraints for absolutely-positioned children?
- Arrow below growing bubble → `constraints.vertical = 'MAX'`
- Arrow above → `constraints.vertical = 'MIN'`
- Centered icon → `{ horizontal: 'CENTER', vertical: 'CENTER' }`

### Template — fill this out before coding:
```
Component: [layout direction] [HUG/FILL/FIXED] × [HUG/FILL/FIXED]
  padding [side] = [value] — reserves space for [what]
  └── [child name]: [in-flow / ABSOLUTE]
        sizing: [HUG/FILL/FIXED] × [HUG/FILL/FIXED]
        text: textAutoResize=[HEIGHT/WIDTH_AND_HEIGHT/NONE]
        constraints (if ABSOLUTE): horizontal=[MIN/CENTER/MAX] vertical=[MIN/CENTER/MAX]
```

### Correct "bubble + arrow" architecture:
```
Component wrapper  (auto-layout VERTICAL or HORIZONTAL)
  padding on arrow side = arrow thickness  ← reserves space, not in flow
  bubble  (in-flow, auto-layout VERTICAL, HUG × HUG, maxWidth = token)
    content TEXT  (FILL × HUG, textAutoResize = 'HEIGHT')
  arrow VECTOR  (ABSOLUTE, constraints pinned to arrow side)
```

| Placement | layoutMode | padding side | arrow constraints |
|---|---|---|---|
| `top` | VERTICAL | paddingBottom | vertical=MAX |
| `bottom` | VERTICAL | paddingTop | vertical=MIN |
| `left` | HORIZONTAL | paddingRight | horizontal=MAX |
| `right` | HORIZONTAL | paddingLeft | horizontal=MIN |
