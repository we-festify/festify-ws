import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, filename: 'bundle-visualization.html' }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@rootui': path.resolve(__dirname, './packages/rootui/src'),
      '@sharedui': path.resolve(__dirname, './packages/sharedui/src'),
      '@bes-ui': path.resolve(__dirname, './packages/bes-ui/src'),
      '@aim-ui': path.resolve(__dirname, './packages/aim-ui/src'),
      '@analog-ui': path.resolve(__dirname, './packages/analog-ui/src'),
      '@bridge-ui': path.resolve(__dirname, './packages/bridge-ui/src'),
      '@methods-ui': path.resolve(__dirname, './packages/methods-ui/src'),

      '@sharedtypes': path.resolve(__dirname, '../../sharedtypes/src'),
    },
  },
  build: {
    rollupOptions: {
      treeshake: true,
    },
  },
});
