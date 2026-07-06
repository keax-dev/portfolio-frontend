<p align="right">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/README-Espa%C3%B1ol-1f6feb?style=for-the-badge" alt="README en Español" />
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/README-English-0e8a16?style=for-the-badge" alt="README in English" />
  </a>
</p>

# Portfolio Frontend

Frontend application for the portfolio website and its admin panel, built with Angular 22, standalone components, Signals, Vitest, and Playwright.

## Overview

This project exposes two main experiences:

- Public portfolio with profile, education, skills, technologies, projects, social links, and contact form.
- Protected admin panel to manage portfolio content and inspect the visitor dashboard.

## Technical stack

- Angular 22
- TypeScript 6
- Angular Router
- Angular CDK Dialog
- RxJS
- Bootstrap 5
- `ngx-spinner`
- Vitest for unit and integration testing
- Playwright for E2E testing
- ESLint + Prettier for static quality checks

## Architecture

The application is organized by layers and features:

- `src/app/core`: cross-cutting services, guards, interceptor, notifications, and session utilities.
- `src/app/shared`: reusable components, directives, and shared interfaces.
- `src/app/features/auth`: authentication flow.
- `src/app/features/portfolio`: public portfolio experience.
- `src/app/features/admin`: admin forms, tables, and visitor dashboard.
- `src/app/integration`: integration tests using real `HttpClient`, Router, and services.
- `e2e`: end-to-end browser flows with Playwright.

Main routes:

- `/`: public portfolio.
- `/login`: authenticated access entry point.
- `/home`: admin panel protected by guard.

## Session behavior

- The authentication interceptor automatically attaches the token to API requests.
- Protected routes rely on guards to redirect unauthenticated users.
- Expired sessions are cleared and redirected to `/login`.
- The admin area starts a watcher that logs out the session once the token expires.

## Backend integration

Configured environments:

- Development: `http://localhost:9090/api`
- Production: `https://www.api.keax.dev/api`

External service used by visitor tracking:

- Geolocation: `https://ip.guide`

## Requirements

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`
- npm compatible with the installed Node version

## Installation

```bash
npm install
```

## Local development

Start the development server:

```bash
npm start
```

The application will be available at:

```text
http://localhost:4200
```

## Available scripts

### Development

```bash
npm start
npm run build
npm run watch
```

### Quality

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
```

### Testing

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:live
```

## Testing strategy

The project separates tests into three levels:

- Unit: isolated validation of components, services, guards, pipes, directives, and the interceptor.
- Integration: real collaboration between `HttpClient`, Router, guards, services, and key components.
- E2E: full browser flows validated with Playwright.

Configured minimum coverage:

- Statements: `80%`
- Branches: `80%`
- Functions: `80%`
- Lines: `80%`

Important notes:

- E2E tests are deterministic and mock the API instead of depending on the external backend.
- `npm run test:e2e:live` runs a separate smoke flow against the real backend and is intentionally excluded from the default deterministic E2E suite.
- Integration tests use `HttpTestingController` and real framework pieces when that adds meaningful coverage.

## Production build

```bash
npm run build
```

Generated output:

```text
dist/frontend
```

The production build includes:

- `environment.ts` replacement with `environment.prod.ts`
- `outputHashing`
- bundle and style budgets

## Project conventions

- Standalone components are the default approach.
- Simple UI state is managed with Signals.
- Routing and route protection are centralized under `core`.
- HTTP contracts use an `ApiResponse<T>` envelope.
- Code quality is enforced with Prettier, ESLint, and typecheck.

## Quick structure

```text
src/
  app/
    core/
    shared/
    features/
      auth/
      portfolio/
      admin/
    integration/
e2e/
public/
```

## Development recommendations

- Run `npm run format:check`, `npm run lint`, and `npm run typecheck` before pushing changes.
- Use `npm run test:unit` for quick local iterations.
- Use `npm run test:integration` when touching authentication, routing, or HTTP services.
- Use `npm run test:e2e` to validate critical flows before closing a delivery.

## Notes

- GitHub does not provide a native README language switcher. The most practical and standard approach is to maintain two files and connect them with badges like the ones at the top.
- If you want later, we can also add a table of contents or extra badges for coverage, lint, and version status.
