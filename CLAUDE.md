# Design System — Rules for Claude

> **Read this file at the start of every session.** Then load the relevant detail files from `.claude/` as needed.

---

## Detail Files

| File | When to load |
|---|---|
| `.claude/patterns-code.md` | Writing CSS, tokens, tooling, CI, library build |
| `.claude/patterns-figma.md` | Building Figma components, pre-build analysis |
| `.claude/documentation.md` | Figma documentation, Storybook template, story rules |
| `.claude/mistakes.md` | Before starting any non-trivial task — scan for relevant past mistakes |
| `.claude/backlog.md` | At the start of every session — check for pending work |

## Documentation Placement Rule

**Every time the user asks to document something**, think before writing:

1. **Where does this belong?** Match to an existing file by topic (code pattern → `patterns-code.md`, Figma component rule → `patterns-figma.md`, doc/Storybook rule → `documentation.md`, mistake → `mistakes.md`, current state → `CLAUDE.md`).
2. **Does it deserve its own file?** If the topic is large (>~80 lines of rules) or completely distinct from existing files — create a new `.claude/` file and add it to the table above.
3. **Is it truly a reusable rule, or just a one-off note?** Reusable rules go in `.claude/`. One-off context (e.g. "in this session we decided X") does not need to be persisted unless it changes how future work is done.
4. **Keep `CLAUDE.md` lean** — it is an index and quick-reference only. Never add long rule blocks directly to `CLAUDE.md`.

---

## Current State

### Code (`packages/web/src/components/`)

| Component | Files | Storybook title | Notes |
|---|---|---|---|
| `Button` | `Button.tsx`, `Button.css`, `Button.stories.tsx` | `Components/Buttons/Button` | 4 variants × 3 sizes, loading/danger/disabled |
| `IconButton` | `IconButton.tsx`, `IconButton.css`, `IconButton.stories.tsx` | `Components/Buttons/IconButton` | 5 variants (adds ghost) × 3 sizes |
| `Icon` | `Icon.tsx`, `Icon.stories.tsx` | `Utilities/Icon` | Wraps `@material-symbols/svg-400` |
| `Loader` | `Loader.tsx`, `Loader.css`, `Loader.stories.tsx` | `Utilities/Loader` | SVG spinner, 5 color variants, any px size |
| `Tooltip` | `Tooltip.tsx`, `Tooltip.css`, `Tooltip.stories.tsx` | `Components/Tooltip` | 12 placements, optional title, pure CSS positioning |
| `Checkbox` | `Checkbox.tsx`, `Checkbox.css`, `CheckboxGroup.tsx`, `index.ts`, `Checkbox.stories.tsx` | `Components/Checkbox` | indeterminate state, error state, standalone mode, CheckboxGroup with vertical/horizontal orientation |
| `Radio` | `Radio.tsx`, `Radio.css`, `RadioGroup.tsx`, `index.ts`, `Radio.stories.tsx` | `Components/Radio` | circular selection dot, error state, standalone mode, RadioGroup propagates `name`/`disabled` via context |
| `Toggle` | `Toggle.tsx`, `Toggle.css`, `index.ts`, `Toggle.stories.tsx` | `Components/Toggle` | switch (`role="switch"`) for immediate on/off; no error/size props; disabled-on keeps muted-brand track; off-state iOS-style contrast (documented in stories) |

### Figma (file `SmpZhN2JSWj1F6NplzoGUN`)

| Page | Component set | ID | Variants | Status |
|---|---|---|---|---|
| `buttons` | `button` | `203:2` | 72 (4 variants × 3 sizes × 6 states) | ✅ complete |
| `icons` | individual icon components | — | `add` (199:3118), `settings` (199:3117), `delete` (391:135), `edit` (391:138), `close` (391:141) | ✅ user-managed |
| `loader` | `loader` | `209:18` | 5 (color variants) | ✅ complete |
| `tooltip` | `tooltip` | `266:26` | 24 (12 placements × 2 show-title states) | ✅ complete |
| `checkbox` | `checkbox` | `500:133` | 15 (checked × state: unchecked/checked/indeterminate × default/hover/pressed/disabled/error) | ✅ complete — `label` (TEXT) / `show-label` (BOOLEAN) component properties |
| `radio` | `radio` | `567:133` | 10 (checked: unchecked/checked × state: default/hover/pressed/disabled/error) | ✅ complete — `show-label` (BOOLEAN) / `label` (TEXT) props, top-aligned box-wrapper |
| `toggle` | `toggle` | `591:133` | 8 (checked: off/on × state: default/hover/pressed/disabled) | ✅ complete — `show-label`/`label` props; thumb position via track `primaryAxisAlignItems`; thumb uses `elevation/1` (none when disabled); no error state |

**Page order:** `buttons → checkbox → icon-button → loader → radio → toggle → tooltip → --- → icons`

**Effect styles:**
| Name | ID | Purpose |
|---|---|---|
| `elevation/0–3` | existing | Box shadows |
| `focus-ring` | `S:522b85a120b1fe5afb5f45a5d197c3a6f2301c46` | Focus indicator for documentation only. Two DROP_SHADOW: spread=2 white gap + spread=4 `color/border/focus`. Applied to instances in doc frames, **not** used in production component variants. |

### Figma Documentation (same file)

| Page | Frame | ID | Sections | Status |
|---|---|---|---|---|
| `tooltip` | `DOCUMENTATION — Tooltip` | `297:26` | Overview, Anatomy, Placements, When to Use/Not, Behavior, Content Guidelines, Dos & Don'ts | ✅ finalized |
| `buttons` | `DOCUMENTATION — Button` | `325:26` | Overview, Variants, Usage Guidelines, Sizes, Behavior, With Icons, Content Guidelines | ✅ finalized |
| `icon-button` | `DOCUMENTATION — IconButton` | `366:253` | Overview, When to Use/Not, Variants (ghost vs tertiary), Sizes, Accessibility, Behavior, Dos & Don'ts | ✅ finalized |
| `checkbox` | `DOCUMENTATION — Checkbox` | `520:148` | Overview, Anatomy, When to Use/Not, States, Behavior, Content Guidelines, Dos & Don'ts | ✅ finalized |
| `radio` | `DOCUMENTATION — Radio` | `572:133` | Overview, Anatomy, When to Use/Not, Grouping, States, Behavior, Content Guidelines, Dos & Don'ts | ✅ finalized |

---

## Established Patterns (Quick Reference)

Full details in `.claude/patterns-code.md` and `.claude/patterns-figma.md`.

**Code:**
- Hover/active → `::after` overlay with `var(--ds-color-surface-1/2)`. Never `filter: brightness()`.
- Typography → `ds-text-*` utility classes in TSX, never manual CSS font values.
- Shadows → `ds-elevation-*` utility classes, never manual `box-shadow`.
- All CSS values → semantic tokens only, no hardcoded numbers.
- Loading → `disabled={disabled || loading}`, content `opacity=0`, loader color per bg type.

**Figma:**
- All names → kebab-case matching code props.
- All fills/strokes/radius/spacing → bound to variables.
- Overlay nodes → always `locked = true`.
- Pages → always inserted in alphabetical order.

---

## Finalization Gate

**Сначала визуал** — запусти Storybook, покажи скриншоты в обеих темах, дай пользователю потестировать. Вноси правки пока не скажет "ок". Только после этого запускай checklist.

**Re-run checks after ANY edit.** Every time code changes — whether a fix you made or an edit the user made on their side — re-run the quality suite (`npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit`, plus `npm run build-storybook` before finalizing). Never report a fix as done without re-running checks on the new state. If you notice the working tree changed (e.g. `git status` shows files you didn't touch), assume the user edited them and re-run checks before continuing.

**Before running the checklist, ask the user:**
> "Компонент готов — финализируем?"

Only proceed after confirmation.

---

## Token ↔ Storybook Sync Rule

**Every time a new variable is added to Figma**, immediately check that it appears in the corresponding Storybook story. And vice versa — when updating a Storybook story, verify all Figma variables for that group are represented.

**How to audit (run in Figma plugin):**
```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const c = collections.find(c => c.name === 'brand-theme-semantics');
const vars = await Promise.all(c.variableIds.map(id => figma.variables.getVariableByIdAsync(id)));
return vars.map(v => v.name).sort();
```
Then compare the output against what's rendered in `Colors.stories.tsx`. Every token must have a row.

**Applies to:** `Colors.stories.tsx` ↔ `brand-theme-semantics`, `Dimensions.stories.tsx` ↔ `display-semantics`

---

## Accessibility — Contrast Check Rule

**Every time you add or modify a color token, or create a new component, run a contrast check.**

### Both themes — always
**Every accessibility check must cover Light AND Dark themes.** A token that passes in Light may fail in Dark (and vice versa). Never audit only one mode.

### When tokens change
- Any new or updated color in `brand-theme-semantics` → calculate contrast for all foreground/background pairs that use it, in **both** Light and Dark
- Minimum ratios: **4.5:1** for text (normal size) · **3:1** for large text and UI components (icons, borders, indicators)
- Disabled states are exempt (WCAG 1.4.3 exception)

### Quick check script
```js
function luminance(hex) {
  const r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const lin = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
}
function contrast(h1, h2) {
  const l1=Math.max(luminance(h1),luminance(h2)), l2=Math.min(luminance(h1),luminance(h2));
  return ((l1+0.05)/(l2+0.05)).toFixed(2);
}
// Example: contrast('#039be6', '#ffffff') → '3.07' ❌
```

### When creating a new component
- Check every text/background and icon/background pair used in the component — in **both** Light and Dark
- Document both ratios in the component's Storybook description
- If a token fails in either theme → pick the nearest primitive that passes before shipping

### Contrast documentation
Full audit with before/after illustrations: `contrast-audit.html` at repo root.
Pending backlog items: see `.claude/backlog.md`.

---

## Consistency Checklist

**Code:**
- [ ] Before any CSS number → checked `dist/web/tokens.light.css` for existing token
- [ ] Token semantic check — token role matches its usage
- [ ] Typography → `ds-text-*` utility class used in TSX
- [ ] Shadows → `ds-elevation-*` utility class used in TSX
- [ ] All CSS values use semantic tokens — no hardcoded values
- [ ] Hover/active use `::after` overlay pattern
- [ ] Loading: `disabled={disabled || loading}`, content `opacity=0`, correct loader color
- [ ] Danger+disabled CSS block is at the bottom of the file
- [ ] `npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit` — all pass
- [ ] New component exported from `src/index.ts`
- [ ] Storybook: correct `title` grouping, Sizes story shows primary variant only
- [ ] Storybook stories have `decorators` with padding for overlays
- [ ] Storybook documentation: JSDoc + prop descriptions + `docs.description.component`

**Figma:**
- [ ] Page name, component name, all property names are kebab-case
- [ ] Page inserted in correct alphabetical position
- [ ] All states present, hover/pressed overlays exist, loading shows `ds-loader`
- [ ] All visual properties bound to variables
- [ ] HUG width verified by screenshot
- [ ] Loader/icon dependencies created before the component
- [ ] Structural check on absolute children (overlay at 0,0; loader centered) — programmatic, not just screenshot
- [ ] All overlay nodes locked (`locked = true`)
- [ ] **Per-state color audit** — `grep` the component CSS for each state class (`--disabled`, `--error`) and assert in the structural-audit script that every variant's label/secondary-element color matches (e.g. disabled label = `text-disabled`, not `text-primary`). Audit must FAIL on a wrong per-state color, not just on missing structure. See mistakes.md #32.
- [ ] Pre-build behaviour analysis done (see `.claude/patterns-figma.md`)

---

## Post-Component Audit

Run after visual is agreed and user confirms finalization. Steps 1–3 in parallel.

**1. Git**
```bash
git status
git log --oneline -5
```

**2. Quality checks** (from `packages/web/`)
```bash
npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit
```

**3. Storybook build**
```bash
npm run build-storybook
```

**4. Figma visual check** — screenshot the component set. Change `content` to a long string — bubble must grow, arrow stays pinned.

**If any step fails → fix before starting the next component.**

After all steps pass → remind the user: _"Всё прошло — нужно закоммитить и запушить."_ Do not commit/push without explicit confirmation.
