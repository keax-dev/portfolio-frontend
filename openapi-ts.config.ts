import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env['OPENAPI_INPUT'] ?? 'http://localhost:9090/v3/api-docs',
  output: 'src/app/shared/api/generated',
  plugins: ['@hey-api/typescript'],
});
