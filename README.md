# design-system

Universal design system — tokens, components, documentation.

---

## Architecture

```
design-system/
├── tokens/                   # Source of truth for all design tokens
│   ├── primitives.json         – Raw values: full color palette + dimensions scale
│   ├── semantics.json          – Theme-aware color aliases (Light / Dark modes)
│   ├── display.json            – Theme-independent tokens: spacing, radius, border, sizing
│   └── typography.json         – Font variables and text/effect styles
├── build-tokens.js           # Custom build script → dist/
├── dist/
│   ├── web/
│   │   ├── tokens.light.css    – CSS custom properties, light mode (:root)
│   │   └── tokens.dark.css     – CSS custom properties, dark mode ([data-theme="dark"])
│   ├── ios/
│   │   └── DesignTokens.swift  – UIColor + CGFloat constants
│   └── android/
│       ├── colors.xml          – Android color resources
│       └── dimens.xml          – Android dimension resources
└── packages/
    └── web/                  # React + Vite + TypeScript reference implementation
        ├── src/components/     – UI components (consume design tokens)
        └── .storybook/         – Storybook 10 component showcase
```

---

## Token Architecture

Four collections, each with a single responsibility:

| Collection | Modes | Purpose |
|---|---|---|
| `global-primitives` | Value | Raw values — full color palette, dimension scale. Hidden from publishing. |
| `brand-theme-semantics` | Light / Dark | Color semantics — background, text, border, brand, status. |
| `display-semantics` | Value | Theme-independent — spacing, radius, border-width, sizing. |
| `typography` | Value | Font family, size, line-height variables + text/effect styles. |

### Two-layer model

| Layer | Purpose | Example |
|---|---|---|
| **Primitive** | Raw, context-free values | `color/primary/500 → #039BE6` |
| **Semantic** | Role/intent aliases → primitive | `color/brand/default → {color/primary/500}` |

Components consume **semantic** tokens only. Never reference a primitive directly from a component.

### Token naming

```
group/subgroup/variant
color/background/default
color/text/secondary
color/status/success/default
spacing/4
radius/md
border/width/1
sizing/md
```

---

## Build

```bash
# Generate all platform outputs from token JSON files
npm run build:tokens
```

Outputs:
- `dist/web/tokens.light.css` — CSS vars for light mode
- `dist/web/tokens.dark.css` — CSS vars for dark mode
- `dist/ios/DesignTokens.swift` — Swift constants
- `dist/android/colors.xml` + `dimens.xml` — Android resources

> **Rule:** always run `npm run build:tokens` after any change to `tokens/*.json` and verify `dist/` output before committing.

---

## Components

### Running Storybook

```bash
cd packages/web
npm run storybook        # → http://localhost:6006
```

### Running dev server

```bash
cd packages/web
npm run dev              # → http://localhost:5173
```

### Component rules

- Every visual property (color, spacing, radius) must use a design token via CSS custom property
- If a required token is missing — stop, discuss, add to the library first
- Tokens are consumed via `var(--ds-*)` CSS custom properties

---

## Contributing

1. **Token changes** → edit `tokens/*.json` → run `npm run build:tokens` → verify `dist/` → commit both
2. **New primitive** → add to `tokens/primitives.json`, hidden from publishing
3. **New semantic token** → add to `tokens/semantics.json` (color) or `tokens/display.json` (dimensions)
4. **New component** → `packages/web/src/components/<Name>/` with `.tsx`, `.css`, `.stories.tsx`
5. **Figma changes** → verify they don't break code, run token build after
