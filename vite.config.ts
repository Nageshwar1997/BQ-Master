import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// `vitest/config`'s `defineConfig` is Vite's own, re-exported with the `test` field typed in -
// `vite dev`/`vite build`/`vite preview` behave identically either way, this only adds the
// option for Vitest to also read this same file instead of needing a second config.
import { defineConfig, type Plugin } from 'vitest/config';

// `@mediapipe/tasks-vision`'s own published build ships a typo'd `sourceMappingURL` comment at
// the end of `vision_bundle.mjs` - it points at `vision_bundle_mjs.js.map`, but the file actually
// sitting next to it on disk is `vision_bundle.mjs.map` (dot, not underscore). Since that package
// is excluded from dep pre-bundling (see `optimizeDeps` below) and served as-is, Vite's dev
// server tries to resolve that comment on every request for the file and logs a "Failed to load
// source map" error/ENOENT for a map file that was never going to exist under that name.
//
// A `transform` hook is too late to fix this - Vite extracts the sourcemap comment from whatever
// `load()` returns *before* running `transform` hooks over it, so patching the comment in
// `transform` never catches it in time. `load()` itself has to return the already-corrected
// content instead, so Vite's own internal extraction step sees the right filename from the start.
// Matched with `includes` (not `endsWith`) and the query string stripped before reading from
// disk - Vite requests this id with a cache-busting `?v=<hash>` suffix, which an `endsWith` check
// silently never matches. Fixes the warning at its source rather than suppressing it; upstream
// bug, nothing to do with this project's own code.
const fixMediapipeSourcemapComment = (): Plugin => ({
  name: 'fix-mediapipe-sourcemap-comment',
  load(id) {
    if (!id.includes('@mediapipe/tasks-vision/vision_bundle.mjs')) return null;

    return readFileSync(id.replace(/\?.*$/, ''), 'utf-8').replace(
      '//# sourceMappingURL=vision_bundle_mjs.js.map',
      '//# sourceMappingURL=vision_bundle.mjs.map',
    );
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    fixMediapipeSourcemapComment(),
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
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
