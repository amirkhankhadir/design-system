import type { Preview } from '@storybook/react-vite';
import React from 'react';

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

        const styleId = 'ds-theme-override';
        let style = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          document.head.appendChild(style);
        }

        if (theme === 'dark') {
          style.textContent = `
            body, .sb-show-main, #storybook-root,
            .docs-story, .sbdocs-wrapper, #storybook-docs,
            .sb-bar, .os-content {
              background: var(--ds-color-background-default) !important;
              color: var(--ds-color-text-primary) !important;
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
  },
};

export default preview;
