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

### Figma (file `SmpZhN2JSWj1F6NplzoGUN`)

| Page | Component set | ID | Variants | Status |
|---|---|---|---|---|
| `buttons` | `button` | `203:2` | 72 (4 variants × 3 sizes × 6 states) | ✅ complete |
| `icons` | individual icon components | — | set by user | ✅ user-managed |
| `loader` | `loader` | `209:18` | 5 (color variants) | ✅ complete |
| `tooltip` | `tooltip` | `266:26` | 24 (12 placements × 2 show-title states) | ✅ complete |

**Page order:** `buttons → icon-button → loader → tooltip → --- → icons`

### Figma Documentation (same file)

| Page | Frame | ID | Sections | Status |
|---|---|---|---|---|
| `tooltip` | `DOCUMENTATION — Tooltip` | `297:26` | Overview, Anatomy, Placements, When to Use/Not, Behavior, Content Guidelines, Dos & Don'ts | ✅ finalized |

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

**Before running the checklist, ask the user:**
> "Компонент готов — финализируем?"

Only proceed after confirmation.

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
- [ ] Pre-build behaviour analysis done (see `.claude/patterns-figma.md`)

---

## Post-Component Audit

Run after every completed component. Steps 1–3 in parallel.

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
