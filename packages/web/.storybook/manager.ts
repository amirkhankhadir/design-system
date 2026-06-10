import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const lightTheme = create({
  base: 'light',
  brandTitle: 'Design System',
  brandUrl: '/',

  colorPrimary: '#039be6',
  colorSecondary: '#039be6',

  // UI
  appBg: '#f8f8f8',
  appContentBg: '#ffffff',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Source Sans 3", sans-serif',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Design System',
  brandUrl: '/',

  colorPrimary: '#039be6',
  colorSecondary: '#039be6',

  // UI
  appBg: '#1e1e1e',
  appContentBg: '#161616',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Source Sans 3", sans-serif',
});

// Default to light; theme toggle in preview.tsx handles the preview canvas
addons.setConfig({
  theme: lightTheme,
});

export { lightTheme, darkTheme };
