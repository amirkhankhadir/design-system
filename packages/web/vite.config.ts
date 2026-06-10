/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Virtual module plugin for Material Symbols SVGs.
 * Resolves `virtual:icon/outlined/home` → raw SVG string from node_modules.
 * This avoids Vite's node_modules glob restriction and ?raw dynamic import issues.
 */
function materialIconsPlugin(): Plugin {
  const PREFIX = '\0virtual:icon/';
  const ICONS_DIR = path.resolve(dirname, '../../node_modules/@material-symbols/svg-400');

  return {
    name: 'material-icons',
    resolveId(id) {
      if (id.startsWith('virtual:icon/')) return PREFIX + id.slice('virtual:icon/'.length);
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return;
      const rest = id.slice(PREFIX.length); // e.g. "outlined/home" or "rounded/search-fill"
      const svgPath = path.join(ICONS_DIR, rest + '.svg');
      try {
        const content = fs.readFileSync(svgPath, 'utf-8');
        return `export default ${JSON.stringify(content)};`;
      } catch {
        return `export default null;`;
      }
    },
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), materialIconsPlugin()],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});