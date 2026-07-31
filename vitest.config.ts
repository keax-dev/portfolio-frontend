import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    maxWorkers: 4,
    testTimeout: 15_000,
    hookTimeout: 15_000,
    teardownTimeout: 15_000,
    coverage: {
      thresholds: {
        'src/app/features/admin/pages/profile/**': {
          statements: 70,
          branches: 50,
          functions: 50,
          lines: 65,
        },
        'src/app/features/admin/pages/skill/**': {
          statements: 75,
          branches: 60,
          functions: 70,
          lines: 75,
        },
        'src/app/features/admin/pages/project/frm-project/**': {
          statements: 70,
          branches: 55,
          functions: 50,
          lines: 70,
        },
        'src/app/features/auth/pages/login/**': {
          statements: 65,
          branches: 55,
          functions: 50,
          lines: 65,
        },
      },
    },
  },
});
