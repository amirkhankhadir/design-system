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
        { name: 'light',  value: '#ffffff' },
        { name: 'subtle', value: '#f5f5f5' },
        { name: 'dark',   value: '#161616' },
        { name: 'brand',  value: '#039be6' },
      ],
    },
  },
};

export default preview;
