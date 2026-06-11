# Documentation Guidelines

## Figma Documentation

Documentation in Figma is for **designers** — explains intent, UX logic, usage rules, behavioral patterns.
Developer details (tokens, CSS, implementation) live in Storybook and Dev Mode.

### Core Principle

> Help designers make decisions. Don't describe what is already visible.

- Don't duplicate Dev Mode / inspect (token values, CSS properties, exact numbers)
- Don't replicate Storybook (prop types, code examples, API details)
- Focus on: **why** the component exists, **when** to use it, **when not to**, **how it behaves**, **how to combine**

### Documentation is NOT a rigid template

Not all sections apply to every component. Ask: which sections genuinely help a designer? Omit the rest.

### Recommended Sections

| # | Section | What to cover |
|---|---------|---------------|
| 1 | **Overview** | What is this, what problem does it solve. Don't describe obvious things. |
| 2 | **When to Use** | Right scenarios. How it differs from similar components. |
| 3 | **When NOT to Use** | Anti-patterns, misuse, limitations. **One of the most important sections.** |
| 4 | **Anatomy** | Key parts, their names, shared vocabulary. No implementation details. |
| 5 | **Variants** | Visual/semantic variants, why each exists — not just how they look. |
| 6 | **States** | Only states that are relevant and non-obvious. |
| 7 | **Behavior** | Interaction timing, dismiss logic, keyboard, focus, edge cases. **Very important.** |
| 8 | **Content Guidelines** | Tone, text length, capitalization, icon usage, wording rules. |
| 9 | **Accessibility** | Keyboard, screen reader expectations, semantic rules. Not a full WCAG audit. |
| 10 | **Responsive Behavior** | Mobile, breakpoints, touch alternatives. Only if relevant. |
| 11 | **Composition** | How it combines with other components, nesting rules. |
| 12 | **Dos & Don'ts** | Good examples, bad examples, common mistakes. Visual where possible. |
| 13 | **Real Examples** | Component in real UI / product context. Not isolated examples. |

### What to Skip

- CSS specifics, token values, margin/padding numbers → visible in Dev Mode
- Prop types, default values, code examples → in Storybook
- Accessibility implementation details (aria, roles) → in Storybook JSDoc

### Documentation Blocks — Template, Not Components

Doc blocks are **NOT** Figma components. Use a single approved reference frame and reproduce the pattern.

**Why not components:** layouts vary per component; changing a doc component risks breaking all existing docs; overhead outweighs benefit at < 20 components.

**How to maintain consistency:** follow section order and spacing from the Tooltip doc frame. Use design system text styles everywhere.

**Revisit when:** same structural change needed across 5+ docs simultaneously.

### Status Badges — Do Not Use

Do **not** add "Stable", "Accessible", "Deprecated" badges. They require active maintenance; stale badges are worse than no badges.

### Text Styles — Always Bind

Every text node must use a design system text style. Never hardcode `fontSize`, `fontWeight`, `lineHeight`.

| Use | Style |
|-----|-------|
| Page title (H1) | `headline/large/2` (32px SemiBold) |
| Section title (H2) | `headline/small/2` or `/3` (20px) |
| Body text | `text/medium/1` (14px Regular) or `text/large/1` (16px Regular) |
| Secondary body | `text/small/1` (12px Regular) |
| Labels / captions | `text/small/2` (12px SemiBold) |
| Section header (uppercase) | `text/xsmall/2` (10px SemiBold) + letter-spacing 8% |

---

## Storybook Cross-Check — Mandatory Before Finalizing

Before finalizing Figma documentation, read the component's Storybook and check for contradictions:

- **Behavioral descriptions** — does doc say "dismisses on Escape" while code handles blur differently? Code wins.
- **Variant/placement names** — must match exact prop values in the TypeScript interface.
- **Content constraints** — `max-width`, `min-width`, character limits must match code.
- **Interaction triggers** — hover, focus, click — verify against real implementation.
- **Keyboard behavior** — Tab, Escape, Enter must match what's implemented.

**If contradiction found:** update Figma doc to match code. Code is the source of truth.

---

## Documentation Layout Rules

### Instances in comparison sections — use the most revealing variant

In Placements, Variants, or any comparison section: always pick the variant that makes differences most visible.
- Example: Placements section → use `show-title=true` so arrow position differences are obvious.
- Default variant is only for the "Default" card. Comparison sections need the richest variant.

### No duplicate documentation across sections

Never document the same behavior in two sections. If "Placement" is its own section, Behavior must not also contain a Placement card.

**Behavior section covers:** timing (delays, animation), keyboard handling, focus management, async states, edge cases.
**Behavior does NOT cover:** placement mechanics, content rules, dos/don'ts — those have their own sections.

### Card row layout at 800px width

- **2 cards per row** — default for behavior/guidelines cards with substantial content
- **3 cards per row** — only for lightweight visual comparison cards (e.g. Dos & Don'ts)
- **Full-width** — for single-concept cards that need space (e.g. a content limit visual)

### Overview — consistent instance alignment

All instances in an Overview row must have the same cell height. Use fixed-height cells with the instance centered inside.

---

## Concept vs. Final Documentation — Lifecycle

**Concept phase** (`DOCUMENTATION CONCEPT — [Component]` frame):
- Exists on the component's Figma page as a separate frame
- Header has "CONCEPT DRAFT" chip
- Purpose: iterate on structure and content before committing

**Finalization** (when user approves):
1. Remove "CONCEPT DRAFT" chip from header
2. Rename frame to `DOCUMENTATION — [Component]`
3. Record finalized structure in CLAUDE.md under "What's been built → Figma documentation"

**Rule:** Never start building a final frame without an approved concept.

---

## Storybook Documentation Template

Every finalized component must have all three layers:

### 1. JSDoc on the component function
```tsx
/**
 * One-line summary of what the component is.
 *
 * **When to use:** [specific scenarios]
 *
 * **When NOT to use:**
 * - [alternative to use instead]
 * - [edge case to avoid]
 *
 * **Accessibility:** [what's handled automatically + what the consumer must do]
 */
export const MyComponent = ...
```

### 2. Prop descriptions in the TypeScript interface
```tsx
export interface MyComponentProps {
  /**
   * Full description with:
   * - what each value means in plain language
   * - when to use each value
   * - any caveats
   */
  variant?: MyVariant;
}
```

### 3. `parameters.docs.description.component` in stories meta
```tsx
const meta: Meta<typeof MyComponent> = {
  parameters: {
    docs: {
      description: {
        component: 'One–two sentences. When to use. Key constraint or accessibility note.',
      },
    },
  },
};
```

---

## Storybook Stories Rules

### Sidebar structure
```
Getting Started → Foundations → Components → Utilities
```

### Grouping rules
1. **Group by family** — related components share a subfolder: `Components/Buttons/Button`, `Components/Buttons/IconButton`
2. **Utilities are separate** — components not used standalone go under `Utilities/`: `Icon`, `Loader`

### Story content rules
- **Sizes story** — show only the primary variant in sm/md/lg. Never all variants × all sizes.
- **No Danger / Loading / Focus standalone stories** — shown inline in the All Variants grid.
- Use a neutral, representative icon for icon-related stories (currently `home`).
- Stories must have `decorators` with padding so tooltips/popovers have room to render.
