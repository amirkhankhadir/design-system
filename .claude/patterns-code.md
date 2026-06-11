# Code Patterns & Tooling

## CSS / Code Patterns

- **Hover/active**: `::after` pseudo-element with `var(--ds-color-surface-1)` / `var(--ds-color-surface-2)`. Never `filter: brightness()` or hardcoded rgba.
- **Typography**: use `ds-text-*` utility classes in TSX — never manual `font-size`/`line-height`/`font-weight` in CSS.
  - `ds-text-small-2` (12px/16px/600) for `sm`
  - `ds-text-medium-2` (14px/20px/600) for `md`/`lg`
- **Shadows**: use `ds-elevation-*` utility classes in TSX — never manual `box-shadow` in CSS.
- **Sizes**: `sm` / `md` / `lg` — heights bound to `sizing/32`, `sizing/40`, `sizing/48`.
- **Loading**: `disabled={disabled || loading}`. Loader color: `'inverse'` on solid-bg variants, `'brand'` on transparent-bg variants.
- **Danger+disabled block**: always last in CSS file to win specificity.
- **Font**: Source Sans 3 via `@fontsource/source-sans-3`.
- **Icons**: `@material-symbols/svg-400`, sizes 16px (sm) / 20px (md/lg).

## Tokens

**Never add new tokens without consulting the user first.**

Use only semantic tokens (`--ds-color-*`, `--ds-spacing-*`, `--ds-radius-*`, `--ds-sizing-*`) — never primitives, never hardcoded values.

### Architecture
- 4 Figma variable collections: `global-primitives`, `brand-theme-semantics` (Light + Dark modes), `typography`, `display-semantics`
- CSS output: `dist/web/tokens.light.css` + `tokens.dark.css`
- Tokens live in `tokens/semantics.json` → built via `build-tokens.js`

### Token sync rule — code AND Figma, always together

| Layer | File | How to add |
|---|---|---|
| Code | `tokens/primitives.json` + `tokens/display.json` (or `semantics.json`) | Edit JSON → `node build-tokens.js` |
| Figma | `global-primitives` + `display-semantics` (or `brand-theme-semantics`) | `use_figma` script |

**Adding a new token = 4 steps, always all 4:**
1. Add primitive value to `tokens/primitives.json`
2. Add semantic variable to `tokens/display.json` with `$alias`, `$value`, `$comment`
3. Run `node build-tokens.js` — regenerates all CSS/iOS/Android outputs
4. Create the same two variables in Figma: primitive in `global-primitives` (scopes `[]`), semantic in `display-semantics` aliased to the primitive with the correct scope

**Never do step 3 without step 4.**

### Token semantic check
Every token used must make semantic sense for its role:
- `color/text/*` → text fill only
- `color/background/*` → surface fill only
- If no fitting token exists → **discuss with user before creating** — do not silently reuse a wrong-category token

## Component CSS

- **Hover/active states via surface overlay only** — `::after` pseudo-element.
- Never use `filter: brightness()` or hardcoded RGBA for states.
- **Danger + disabled block always last** in the CSS file.
- `disabled={disabled || loading}` in TSX.

## Loader Colors

Valid `LoaderColor` values: `'brand' | 'inverse' | 'on-brand' | 'static-white' | 'static-black'`

- Solid-bg variants (primary, secondary, tertiary): `'inverse'`
- Transparent-bg variants (link, ghost): `'brand'`

## Tooling (`packages/web`)

| Tool | Config file | Run |
|---|---|---|
| TypeScript | `tsconfig.json` | `npx tsc --noEmit` |
| ESLint | `eslint.config.js` | `npm run lint` |
| Prettier | `.prettierrc` | `npm run format:check` |
| Stylelint | `.stylelintrc.json` | `npm run lint:css` |

- **ESLint**: flat config (ESLint 9/10), React + TypeScript rules, Prettier disables conflicting rules at the end.
- **Prettier**: `singleQuote`, `semi`, `tabWidth: 2`, `trailingComma: es5`, `printWidth: 100`, `arrowParens: avoid`.
- **Stylelint**: `stylelint-config-standard` base. `no-descending-specificity: null` disabled (intentional overlay pattern). `value-keyword-case: lower` with `camelCaseSvgKeywords: true`.

## Library Build

- Script: `npm run build:lib` (uses `vite.lib.config.ts`)
- Output: `dist/lib/index.js` (ESM), `dist/lib/index.d.ts` (types), `dist/lib/index.css`
- `react` and `react-dom` are **external** — not bundled
- Consumers must import styles separately: `import '@design-system/web/styles'`
- **Icon in production**: fetches SVGs from `/__icons/{variant}/{name}.svg` via `materialIconsPlugin`. Consumer apps must add to `vite.config.ts`:
  ```ts
  import { materialIconsPlugin } from '@design-system/web/vite-plugin';
  export default defineConfig({ plugins: [react(), materialIconsPlugin()] });
  ```

## Changesets (versioning)

- Config: `.changeset/config.json` (root)
- Workflow: `npm run changeset` → describe change → `npm run version` → `npm run release`

## CI (`github/workflows/ci.yml`)

Steps: install root deps → build tokens → install web deps → type-check → lint → lint:css → format:check → build-storybook.
Triggers: push to `main` + all PRs.
