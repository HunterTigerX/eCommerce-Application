import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [react(), tsconfigPaths()],
    };
  } else {
    return {
      mode: 'dev',
      plugins: [react(), tsconfigPaths()],
      resolve: {
        alias: {
          stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        },
      },
      optimizeDeps: {
        esbuildOptions: {
          define: {
            global: 'globalThis',
          },
          plugins: [
            NodeGlobalsPolyfillPlugin({
              process: true,
              buffer: true,
            }),
            NodeModulesPolyfillPlugin(),
          ],
        },
      },
      build: {
        rollupOptions: {
          plugins: [rollupNodePolyFill()],
        },
      },
    };
  }
});
