import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { addons } from '@storybook/preview-api';
import { lightTheme, darkTheme } from './manager';

// Both themes loaded — light via :root, dark via [data-theme="dark"]
import '../../../dist/web/tokens.light.css';
import '../../../dist/web/tokens.dark.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark',  title: 'Dark',  icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'light';

      React.useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);

        // Sync Storybook manager theme
        addons.setConfig({ theme: theme === 'dark' ? darkTheme : lightTheme });

        const styleId = 'ds-theme-override';
        let style = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          document.head.appendChild(style);
        }

        if (theme === 'dark') {
          style.textContent = `
            /* Canvas & docs background */
            body, .sb-show-main, #storybook-root,
            .sbdocs-wrapper, #storybook-docs, .os-content,
            .docs-story > div {
              background: var(--ds-color-background-default) !important;
            }

            /* Docs text */
            .sbdocs-wrapper, .sbdocs-wrapper h1, .sbdocs-wrapper h2,
            .sbdocs-wrapper h3, .sbdocs-wrapper p, .sbdocs-wrapper span,
            .sbdocs-wrapper div, .sbdocs-wrapper label,
            #storybook-docs, #storybook-docs * {
              color: var(--ds-color-text-primary) !important;
            }

            /* Controls / ArgsTable */
            .docblock-argstable, .docblock-argstable th,
            .docblock-argstable td, .docblock-argstable tr,
            .docblock-argstable thead, .docblock-argstable tbody {
              background: var(--ds-color-background-subtle) !important;
              color: var(--ds-color-text-primary) !important;
              border-color: var(--ds-color-border-subtle) !important;
            }
            .docblock-argstable input, .docblock-argstable select,
            .docblock-argstable button {
              background: var(--ds-color-background-muted) !important;
              color: var(--ds-color-text-primary) !important;
              border-color: var(--ds-color-border-default) !important;
            }

            /* Story canvas container */
            .docs-story {
              background: var(--ds-color-background-default) !important;
              border-color: var(--ds-color-border-subtle) !important;
            }

            /* Toolbar above story preview (zoom/refresh bar) */
            [class*="Toolbar"], [class*="toolbar"],
            .os-scrollbar, [class*="StoryCanvas"],
            div[aria-label="Story canvas"] > div:first-child {
              background: var(--ds-color-background-subtle) !important;
              border-color: var(--ds-color-border-subtle) !important;
              color: var(--ds-color-text-secondary) !important;
            }
            div[aria-label="Story canvas"] button,
            div[aria-label="Story canvas"] svg {
              color: var(--ds-color-icon-default) !important;
            }

            /* Section headers like STORIES */
            .sbdocs-wrapper .css-1x7q2op, [class*="StoriesHeader"] {
              color: var(--ds-color-text-tertiary) !important;
            }
          `;
        } else {
          style.textContent = '';
        }

        return () => {
          html.removeAttribute('data-theme');
          if (style) style.textContent = '';
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
    backgrounds: { disable: true }, // replaced by our theme switcher
    docs: {
      theme: lightTheme,
    },
  },
};

export default preview;
