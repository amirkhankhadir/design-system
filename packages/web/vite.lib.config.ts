import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/components/**', 'src/index.ts', 'src/vite-plugin-material-icons.ts'],
      exclude: ['src/**/*.stories.tsx', 'src/main.tsx'],
      outDir: 'dist/lib',
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(dirname, 'src/index.ts'),
        'vite-plugin': path.resolve(dirname, 'src/vite-plugin-material-icons.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Peer deps + Node built-ins — don't bundle
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'vite',
        'node:path',
        'node:fs',
        'node:url',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: 'index[extname]',
      },
    },
    outDir: 'dist/lib',
    sourcemap: true,
    emptyOutDir: true,
  },
});
