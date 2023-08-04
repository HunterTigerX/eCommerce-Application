import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [react()],
    };
  } else {
    return {
      mode: 'dev',
      plugins: [react()],
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
