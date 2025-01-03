import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.lib.json',
    }),
    visualizer({ open: true, filename: 'bundle-visualization.html' }),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@femails': path.resolve(__dirname, './lib'),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'Femails',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'lib/index.ts'),
      },
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        entryFileNames: '[name].[format].js', // Output file naming for preserved modules
      },
    },
  },
});
