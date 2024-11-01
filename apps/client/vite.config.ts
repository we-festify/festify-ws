import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
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
    },
  },
});
