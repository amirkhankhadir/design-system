import type { Preview } from '@storybook/react-vite';
import React from 'react';

// Font — Source Sans 3 (weights: 400 Regular · 500 Medium · 600 SemiBold · 700 Bold)
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/500.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';

// Both themes loaded — light via :root, dark via [data-theme="dark"]
import '../../../dist/web/tokens.light.css';
import '../../../dist/web/tokens.dark.css';

const DARK_OVERRIDE = `
  body, .sb-show-main, #storybook-root,
  .sbdocs-wrapper, #storybook-docs, .os-content {
    background: var(--ds-color-background-default) !important;
    color: var(--ds-color-text-primary) !important;
  }

  /* ── Controls table (argstable) ────────────────────────────── */
  .docblock-argstable, .docblock-argstable-head th,
  .docblock-argstable-body td, .docblock-argstable-body tr {
    background: var(--ds-color-background-subtle) !important;
    border-color: var(--ds-color-border-subtle) !important;
    color: var(--ds-color-text-primary) !important;
  }
  /* All text inside argstable cells */
  .docblock-argstable td *, .docblock-argstable th *,
  [class*="ArgValue"], [class*="ArgDescription"],
  [class*="ArgName"], [class*="StyledPre"],
  [class*="ResetWrapper"] td, [class*="ResetWrapper"] th {
    color: var(--ds-color-text-primary) !important;
  }
  /* Type hints / secondary text — scoped to argstable to avoid matching btn--secondary etc. */
  .docblock-argstable [class*="Secondary"] {
    color: var(--ds-color-text-secondary) !important;
  }
  .docblock-argstable input, .docblock-argstable select,
  .docblock-argstable textarea, .docblock-argstable button {
    background: var(--ds-color-background-muted) !important;
    color: var(--ds-color-text-primary) !important;
    border-color: var(--ds-color-border-default) !important;
  }
  /* BooleanControl toggle — label is a pill with input + two spans.
     Active span always gets white bg (Storybook CSS) → text must be dark regardless of theme.
     Inactive span sits on our dark bg → text must be light.
     Never set color on <label> itself — it inherits into the active span, making white-on-white. */
  .docblock-argstable label {
    background: var(--ds-color-background-muted) !important;
    border-color: var(--ds-color-border-default) !important;
  }
  .docblock-argstable label input:not(:checked) ~ span:first-of-type,
  .docblock-argstable label input:checked ~ span:last-of-type {
    color: #1f2328 !important;
  }
  .docblock-argstable label input:checked ~ span:first-of-type,
  .docblock-argstable label input:not(:checked) ~ span:last-of-type {
    color: var(--ds-color-text-secondary) !important;
  }

  /* ── Docs page ─────────────────────────────────────────────── */
  .docs-story { background: var(--ds-color-background-default) !important; }
  .sbdocs h1, .sbdocs h2, .sbdocs h3, .sbdocs h4,
  .sbdocs a, .sbdocs-a,
  [class*="DocsStory"] h3, [class*="DocsStory"] h2,
  [class*="StoriesHeader"], [class*="StoriesTitle"] {
    color: var(--ds-color-text-primary) !important;
  }
  /* "STORIES" section label — PascalCase only (CSS modules), won't match component kebab-case */
  [class*="GroupTitle"] {
    color: var(--ds-color-text-secondary) !important;
  }

  /* ── Inline code (e.g. prop values in descriptions) ───────── */
  .sbdocs code, .sbdocs-content code,
  [class*="InlineCode"], [class*="code-block"],
  .docblock-source {
    background: var(--ds-color-background-muted) !important;
    color: var(--ds-color-text-primary) !important;
    border-color: var(--ds-color-border-subtle) !important;
  }

  /* ── Body text in docs (Storybook CSS-module classes only — PascalCase) ──
     Never use .sbdocs p / .sbdocs-content p — those reach into story canvas
     and override component token colors (see mistakes.md #10 + #26).
     Exception: .sbdocs-content > p with DIRECT CHILD selector (>) is safe —
     the component description sits here and story canvases are nested deeper. */
  [class*="DocsContent"] p, [class*="DocsContent"] li,
  [class*="Description"] p, [class*="Description"] li,
  [class*="Markdown"] p, [class*="Markdown"] li {
    color: var(--ds-color-text-primary) !important;
  }
  html[data-theme="dark"] .sbdocs-content > p {
    color: var(--ds-color-text-primary) !important;
  }

  /* ── Toolbar ───────────────────────────────────────────────── */
  [role="toolbar"], [class*="ToolbarWrapper"],
  [class*="PreviewWrapper"] > div:first-child {
    background: var(--ds-color-background-subtle) !important;
    border-color: var(--ds-color-border-subtle) !important;
  }
`;

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'light';

      React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        const id = 'ds-theme-override';
        let el = document.getElementById(id) as HTMLStyleElement | null;
        if (!el) {
          el = document.createElement('style');
          el.id = id;
          document.head.appendChild(el);
        }
        el.textContent = theme === 'dark' ? DARK_OVERRIDE : '';

        return () => {
          document.documentElement.removeAttribute('data-theme');
          if (el) el.textContent = '';
        };
      }, [theme]);

      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Getting Started', 'Foundations', 'Components', 'Utilities', 'Internal'],
      },
    },
  },
};

export default preview;
