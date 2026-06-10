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
 * Material Symbols plugin — serves SVGs via a dev middleware at
 * GET /__icons/{variant}/{name}.svg
 * The Icon component fetches from this endpoint at runtime.
 */
function materialIconsPlugin(): Plugin {
  const ICONS_DIR = path.resolve(dirname, '../../node_modules/@material-symbols/svg-400');

  return {
    name: 'material-icons',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/__icons\/(outlined|rounded)\/(.+)\.svg$/);
        if (!match) return next();
        const [, variant, name] = match;
        const svgPath = path.join(ICONS_DIR, variant, `${name}.svg`);
        try {
          const content = fs.readFileSync(svgPath, 'utf-8');
          res.setHeader('Content-Type', 'image/svg+xml');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          res.end(content);
        } catch {
          res.statusCode = 404;
          res.end('Icon not found');
        }
      });
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