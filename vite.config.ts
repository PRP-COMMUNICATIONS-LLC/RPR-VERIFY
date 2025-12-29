import { defineConfig } from 'vitest/config';

// Minimal Vite config for running Vitest on TypeScript files in an Angular project.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
