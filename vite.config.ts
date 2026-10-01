import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// `vitest/config`'s `defineConfig` is Vite's own, re-exported with the `test` field typed in -
// `vite dev`/`vite build`/`vite preview` behave identically either way, this only adds the
// option for Vitest to also read this same file instead of needing a second config.
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      visualizer({ open: true, filename: 'stats.html', gzipSize: true, brotliSize: true }),
  ].filter(Boolean),
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { port: 3004 },
  // `@mediapipe/tasks-vision` ships its own WASM runtime that it loads itself
  // (from a pinned CDN URL, see `FaceLandmarkerCache.ts`) - letting Vite's
  // dep pre-bundler touch it breaks that loading at dev time, so it's excluded.
  optimizeDeps: { exclude: ['@mediapipe/tasks-vision'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('react-dom')) return 'react';
          }

          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1 MB
  },
  test: {
    // Every current test target (tryon.util/tryon-lip.util/tryon-lip.constants) is pure
    // functions/data - no DOM needed, so plain `node` runs faster than spinning up jsdom. A
    // future test that genuinely needs the DOM (e.g. a component test) can override this per
    // file with a `// @vitest-environment jsdom` comment rather than paying that cost globally.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
