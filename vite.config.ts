import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [react()],
    };
  } else {
    return {
      define: {
        'process.env.CTP_CLIENT_ID': JSON.stringify(env.CTP_CLIENT_ID),
        'process.env.CTP_CLIENT_SECRET': JSON.stringify(env.CTP_CLIENT_SECRET),
        'process.env.CTP_PROJECT_KEY': JSON.stringify(env.CTP_PROJECT_KEY),
        'process.env.CTP_AUTH': JSON.stringify(env.CTP_AUTH),
        'process.env.CTP_API': JSON.stringify(env.CTP_API),
    },
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
