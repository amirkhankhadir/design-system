# Context Handoff — start here for a fresh session or account

Purpose: bring a fresh Claude (new chat, or a different account) fully up to speed on this project in one read. If you are that fresh session — read this top to bottom, then read the canonical files listed below, then confirm you understand where things stand before doing anything.

---

## What this is

A **cross-platform design system** (a personal project). One source of truth for the visual language → generated per platform, plus a reference component implementation (web) and documentation (Figma + Storybook). Full framing is in `README.md` ("Purpose" + "Current Status").

## Read these first (canonical sources of truth, all in this repo)

1. `CLAUDE.md` — working rules + Current State tables (components, Figma node IDs). **Read every session.**
2. `.claude/patterns-code.md` — CSS/token/tooling/build patterns.
3. `.claude/patterns-figma.md` — Figma component-building patterns.
4. `.claude/documentation.md` — Figma docs + Storybook story rules.
5. `.claude/mistakes.md` — 40 documented lessons. **Scan before any non-trivial task.**
6. `.claude/backlog.md` — open/agreed work.
7. `README.md` — purpose, architecture, platform-readiness status.

Do not paraphrase these back — just absorb them.

## Tech at a glance

- **Tokens:** `tokens/*.json` → `build-tokens.js` → `dist/` for **Web (CSS)**, **iOS (Swift)**, **Android (XML)**. Covers colors, spacing, radius, typography, elevation, with Light/Dark. All three platforms are complete. `dist/` is gitignored — regenerate with `npm run build:tokens`.
- **Web components:** React 18 + TypeScript + Vite, styles via `var(--ds-*)` tokens, documented in Storybook 10 (autodocs). Components: Button, IconButton, Icon, Loader, Tooltip, Checkbox, Radio, Toggle. Packaged as `@design-system/web` (not yet published to a registry).
- **Figma:** file `SmpZhN2JSWj1F6NplzoGUN` — components + documentation frames mirror the web side. **Figma access is a separate MCP + login, not carried by git** — the new environment must authorize its own Figma connection. Load the `figma-use` skill before any `use_figma` call.

## How to work here (the user's confirmed preferences)

- **Visual-first, then checks, then commit.** Build → show screenshots in **both** themes → iterate until the user says "ок" → *then* run the quality checks → commit/push **only after explicit confirmation**.
- **Re-run the full check suite after ANY edit** — yours or the user's. If `git status` shows files you didn't touch, assume the user edited them and re-check. Suite (from `packages/web`): `npm run lint && npm run lint:css && npm run format:check && npx tsc --noEmit`; add `npm run build-storybook` before finalizing.
- **Document every mistake immediately** in `.claude/mistakes.md` (with what/why/rule).
- **Figma specifics:** verify via `get_screenshot` / metadata, not batched `node.screenshot`; link styles with the async setters (`setEffectStyleIdAsync`, etc.), never the sync `effectStyleId =`; put the `show-*` boolean property before the value it gates; assert per-state label color in structural audits.
- **Address the user in masculine** (his name is Amirkhan).
- He values that you **verify and explain** decisions rather than just generate — surface tradeoffs, don't hide them.

## Where things stand / open threads

- Components (web + Figma) complete: Button, IconButton, Icon, Loader, Tooltip, Checkbox, Radio, Toggle. Figma docs finalized for Tooltip, Button, IconButton, Checkbox, Radio.
- **backlog H:** publish the npm package (deferred — no consumers yet); mobile token output (typography + elevation) — done.
- **backlog I:** package this project as a **portfolio case**, angle *"working with AI"* — build a coherent component set + a small showcase app that proves the system (live Light/Dark, accessibility, states). App idea not chosen yet; will likely need Input, Select, Card.
- **Remaining docs:** `DOCUMENTATION — Toggle` (Figma) + a "Checkbox vs Toggle" section in `DOCUMENTATION — Checkbox` (node `520:148`).
- Deeper strategy threads (handing the system off to real product teams; the user's growth toward design-systems / design-engineer work) live in the local memory layer, not git.

## Restoring the personal memory layer (optional)

The local memory files (`MEMORY.md` + feedback/project notes) live at `~/.claude/projects/<project-slug>/memory/` on the original machine. Copy that folder's contents into the new environment's equivalent path for the full personal layer. This handoff file already covers the essentials, so it's optional.

---

**First action for a fresh session:** read the canonical files above, then reply with a short confirmation of the current state and the open threads — do not start changing anything until the user directs you.
