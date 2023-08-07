import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
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
    };
  }
});
