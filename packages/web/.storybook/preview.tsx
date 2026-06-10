import type { Preview } from '@storybook/react-vite';

// Design tokens — light mode by default
import '../../../dist/web/tokens.light.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--ds-color-background-default, #ffffff)' },
        { name: 'subtle', value: 'var(--ds-color-background-subtle, #f8f8f8)' },
        { name: 'dark',  value: '#161616' },
        { name: 'brand', value: 'var(--ds-color-brand-default, #039be6)' },
      ],
    },
  },
};

export default preview;
