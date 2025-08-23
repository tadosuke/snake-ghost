import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      // Enable TypeScript type checking
      typescript: true,
      // Disable ESLint integration in vite-plugin-checker for now
      // to avoid compatibility issues
      overlay: {
        initialIsOpen: false,
      },
      terminal: true,
      enableBuild: true,
    }),
  ],
});
