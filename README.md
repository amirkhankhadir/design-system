# design-system

Universal design system — tokens, components, documentation.

---

## Purpose

A single **source of truth for the visual language** (colors, typography, spacing, radius, elevation) that is meant to be shared across **Web, iOS, and Android**, plus a **reference component implementation** and **documentation** (Figma for designers, Storybook for developers).

The intended adoption model:
- **Tokens** are generated from one source (`tokens/*.json`) into each platform's native format, so every platform speaks the same visual language with built-in Light/Dark support.
- **Components** are provided as ready-to-use code for the web; other platforms either consume the web components (if they use the web) or **re-implement the components natively** using the Figma + Storybook documentation as the spec.

This mirrors how mature design systems (Material, Polaris, Atlassian) hand off: shared tokens + per-platform component implementations.

---

## Current Status

> **Keep this section up to date.** Whenever platform readiness, the component list, the token output, or the publish status changes, update the table below.

| Layer | Web | iOS | Android |
|---|---|---|---|
| **Tokens** | ✅ colors, dimensions, typography, elevation — CSS custom properties | ⚠️ colors + dimensions only — Swift (`DesignTokens.swift`). **No typography / elevation yet** | ⚠️ colors + dimensions only — XML (`colors.xml`, `dimens.xml`). **No typography / elevation yet** |
| **Components** | ✅ React 18 + TypeScript — Button, IconButton, Icon, Loader, Tooltip, Checkbox, Radio, Toggle | ❌ none (build natively from spec) | ❌ none (build natively from spec) |
| **Documentation** | ✅ Storybook (autodocs) + Figma | uses Figma / Storybook as the spec | uses Figma / Storybook as the spec |
| **Distribution** | ⚠️ packaged as `@design-system/web` (npm-shaped, versioned via changesets) but **not yet published to a registry** | — | — |

**Known gaps before a real product hand-off:**
1. The web package is **not published** to any npm registry yet (set up, but `npm run release` never run).
2. **No native mobile components** — mobile teams get tokens, then build components themselves.
3. **Mobile token output is incomplete** — iOS/Android emit only colors + dimensions; typography and elevation exist in the source and in the web output but are not yet generated for Swift/XML (`build-tokens.js` → `buildSwift` / `buildAndroid*` don't handle them).
4. Web components require **React 18** (peer dependency); non-React web stacks can use the token CSS but not the components.

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
