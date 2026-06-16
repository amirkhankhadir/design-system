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

### Every described behaviour needs a visual example

**Never write text-only documentation.** Every card that describes a behaviour must have a visual preview — an instance, an illustration, or a diagram above the text.

Checklist before finalising any section:
- Tooltip card → show a button instance + tooltip appearing
- Keyboard card → show key chip illustration (not just text)
- State card → show the actual state variant (loading spinner, danger color, etc.)
- Dos & Don'ts → the instances must USE meaningful icons/props, not the default placeholder

**Scan the full doc before declaring done:** open each card mentally and ask "does a designer understand this without reading the text?"

### Use realistic content, not placeholder text

The same rule that applies to icons (below) applies to any TEXT property on a documentation instance: never leave the component's generic default ("Checkbox label", "Button", "Label") in a card that's making a specific point. Set realistic, context-appropriate copy that matches what the card is actually teaching.

- "Use a statement, not a question" → label the instance with an actual statement ("Email me weekly updates"), not the literal phrase "statement"
- "Don't write long labels" → use a genuinely long, real-sounding sentence, not a short placeholder — the example needs to actually be wrong to be convincing
- Dos & Don'ts pairs comparing two states of the same idea (e.g. error before/after checked) → reuse the *same* realistic label on both sides, so the only variable is the thing being illustrated

**If a long/realistic string causes overflow or clipping** (e.g. a wrapped label pushing past a card's edge), that's a real layout bug to fix on that instance — not a reason to fall back to a short placeholder. Shortening the text hides the problem instead of demonstrating it; fix the wrap/sizing instead (see Checkbox mistakes #32+ for an example).

### Use instance swap for meaningful visual examples

Never leave default icons in documentation instances. Always swap to the icon that makes the use case obvious:
- aria-label example → `delete` icon (the label IS the icon name)
- toolbar example → mix of `edit`, `delete`, `settings`, `close`
- tooltip example → `settings` + `delete` (recognisable actions)

```js
// Safe swap — only when the new icon differs from the component default
const iconKey = Object.keys(inst.componentProperties).find(k => k.startsWith('icon#'));
if (inst.componentProperties[iconKey].value !== targetIconId) {
  inst.setProperties({ [iconKey]: targetIconId });
}
```

### Keyboard & focus illustrations — use key chips, not labels

Text labels like "focused" are not enough. Show the interaction:

```
┌──────────────────┐  ┌─────────────────────────────┐
│  [btn + ring]    │  │  [btn + ring]               │
│                  │  │                             │
│  ┌─────┐         │  │  ┌───────────────┐          │
│  │ Tab │         │  │  │ Enter / Space │          │
│  └─────┘         │  │  └───────────────┘          │
│  Move focus      │  │  Activate                   │
└──────────────────┘  └─────────────────────────────┘
```

Key chip recipe: auto-layout frame, padding 4/8, cornerRadius 6, fill=`color/background/subtle`, stroke=`color/border/subtle`, text style `text/small/2`.

Focus ring on demo instances: apply `focus-ring` effect style (`S:522b85a120b1fe5afb5f45a5d197c3a6f2301c46`) to the instance — **only on variants with a solid background fill** (e.g. `primary`). Ghost/link variants have no fill and the ring will be invisible.

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

### Card visual style — match Tooltip doc exactly

**Main doc frame:**
- `paddingTop/Left/Right: 56px`, `paddingBottom: 64px`
- `itemSpacing: 48px` between sections
- Content area width = 688px (800 − 56×2)
- `cornerRadius: 12`
- `strokeWeight: 1`, `strokeAlign: INSIDE`, stroke = `color/border/subtle`
- fill = `color/background/default`

**All cards — required properties:**
| Property | Value |
|---|---|
| `cornerRadius` | **8** (never 12) |
| `padding` | **20px** all sides |
| `itemSpacing` | **12** (content gap inside card) |
| `strokeWeight` | 1, `strokeAlign: INSIDE` |

**Card type → fill/stroke:**

| Card type | `fills` | `strokes` |
|---|---|---|
| Regular content card (Variants, Sizes, Behavior, Icons) | `color/background/default` | `color/border/subtle` |
| "When to use" / Dos cards | `color/status/success/subtle` | none |
| "When NOT to use" / Don'ts cards | `color/status/error/subtle` | none |
| Note / info pill | `color/border/subtle` as fill | none |

**Section labels:**
- Style: `text/xsmall/2` (10px SemiBold)
- `letterSpacing: { value: 0, unit: 'PERCENT' }` — **never add letter-spacing**

**No accent strips.** Colored cards use fill background only — no top strip, no additional decorations.

### Wrapping tag/pill rows inside cards

When a row of pills/tags can overflow the card width, use `layoutWrap = 'WRAP'` with **both** gap values set:

```js
tagsFrame.layoutWrap = 'WRAP';
tagsFrame.itemSpacing = 6;          // horizontal gap between pills in the same row
tagsFrame.counterAxisSpacing = 6;   // vertical gap between wrapped rows — DO NOT SKIP
tagsFrame.layoutSizingHorizontal = 'FILL'; // fills the card's inner width so wrap triggers
tagsFrame.counterAxisSizingMode = 'AUTO';  // card grows vertically as rows wrap
```

**Common mistake:** setting only `itemSpacing` and forgetting `counterAxisSpacing`. Result: pills wrap correctly but rows are squished together with no vertical gap. Always set both.

### Dos & Don'ts — exact structure

Each Do/Don't item is a **wrapper frame** (no fill, no stroke) containing:
1. **Preview area** — FRAME, `cornerRadius:8`, `paddingTop:28`, `paddingLeft/Right:24`, fill = success/subtle (Do) or error/subtle (Don't)
   - Button/component instance lives inside
2. **"✓  Do" / "✗  Don't"** — TEXT, `text/small/2` (12px SemiBold), colored green/red
3. **Description** — TEXT, `text/small/1` (12px Regular), secondary text color

Layout: **Do | Don't** paired per row (not "all Dos then all Don'ts"). Max 2 per row for Dos & Don'ts.

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

Every new component story file **must** include `tags: ['autodocs']` in the meta object and an `argTypes` block with descriptions for every prop. Without `tags: ['autodocs']`, Storybook does not generate a Docs page and the component is undocumented in the sidebar.

Also required: a `Default` story with `args` so the Docs page renders the component interactively with working controls.

```tsx
const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],          // ← required for Docs page
  parameters: { docs: { description: { component: '...' } } },
  argTypes: {
    variant: { control: 'select', options: [...], description: '...' },
    // one entry per prop
  },
};

export const Default: Story = {
  args: { /* meaningful defaults */ },
};
```

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
