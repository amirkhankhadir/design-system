import type { Plugin } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite plugin — serves Material Symbols SVGs via a dev middleware.
 *
 * The Icon component fetches SVGs at runtime from `/__icons/{variant}/{name}.svg`.
 * Add this plugin to your app's vite.config.ts so icons work in development
 * and production builds.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { materialIconsPlugin } from '@design-system/web/vite-plugin';
 *
 * export default defineConfig({
 *   plugins: [react(), materialIconsPlugin()],
 * });
 * ```
 */
export function materialIconsPlugin(): Plugin {
  // Resolve icons dir relative to node_modules — works whether the package
  // is used locally or installed as a dependency.
  const candidates = [
    // local monorepo: packages/web/src/ → ../../node_modules
    path.resolve(dirname, '../../node_modules/@material-symbols/svg-400'),
    // installed as npm package: dist/lib/ → ../../../node_modules
    path.resolve(dirname, '../../../node_modules/@material-symbols/svg-400'),
    // consumer app: node_modules at project root
    path.resolve(process.cwd(), 'node_modules/@material-symbols/svg-400'),
  ];

  const ICONS_DIR = candidates.find(p => fs.existsSync(p)) ?? candidates[0];

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
