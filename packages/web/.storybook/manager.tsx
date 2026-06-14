import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { SunIcon, MoonIcon } from '@storybook/icons';

const ADDON_ID = 'ds-theme-toggle';
const TOOL_ID = `${ADDON_ID}/tool`;

function ThemeToggle() {
  const [globals, updateGlobals] = useGlobals();
  const isDark = globals.theme === 'dark';

  return (
    <IconButton
      key={TOOL_ID}
      title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      onClick={() => updateGlobals({ theme: isDark ? 'light' : 'dark' })}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <ThemeToggle />,
  });
});
