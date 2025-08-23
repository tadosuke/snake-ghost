import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      // Enable ESLint checking during development and build
      eslint: {
        // Use the existing ESLint configuration
        lintCommand: 'eslint "./src/**/*.{ts,tsx}" --max-warnings 0',
        // Show ESLint errors in the browser overlay during development
        dev: {
          logLevel: ['error', 'warning'],
        },
      },
      // Enable TypeScript type checking
      typescript: true,
      // Fail build on errors
      overlay: {
        initialIsOpen: false,
      },
      terminal: true,
      enableBuild: true,
    }),
  ],
});