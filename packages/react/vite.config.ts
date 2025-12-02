import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'StliteReact',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') {
          return 'stlite-react.mjs';
        }
        if (format === 'umd') {
          return 'stlite-react.umd.cjs';
        }
        return `stlite-react.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@stlite/browser'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@stlite/browser': 'StliteBrowser', // Assuming this global name
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css';
          }
          return assetInfo.name ?? 'assets/[name]-[hash][extname]'; // Robust fallback
        },
      },
    },
  },
});