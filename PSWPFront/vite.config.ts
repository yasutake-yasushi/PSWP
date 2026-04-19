import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('ag-grid-community') || id.includes('ag-grid-enterprise') || id.includes('ag-grid-react')) {
            return 'ag-grid';
          }

          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
