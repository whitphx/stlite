import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'StliteReact',
      fileName: (format) => `stlite-react.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@stlite/browser'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@stlite/browser': 'stlite', // Global name if used via UMD
        },
      },
    },
    copyPublicDir: false, // We don't have public assets for the lib itself
  },
});