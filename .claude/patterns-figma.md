# Figma Component Patterns

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
