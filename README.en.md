<p align="right">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/README-Espa%C3%B1ol-1f6feb?style=for-the-badge" alt="README en Español" />
  </a>
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/README-English-0e8a16?style=for-the-badge" alt="README in English" />
  </a>
</p>

# Portfolio Frontend

Frontend application for the public portfolio and admin panel, built with Angular 22, standalone components, Angular Material, Vitest, Playwright, and automated Docker-based deployment.

## Functional overview

This project exposes two main experiences:

- Public portfolio with profile, education, skills, technologies, projects, social links, and contact form.
- Protected admin panel used to manage portfolio content and inspect the visitor dashboard.

Main routes:

- `/`: public portfolio.
- `/login`: authenticated access entry point.
- `/home`: admin panel protected by a guard.

## What is implemented

### Public portfolio

- Main profile loading with photo, description, CV, and social links.
- Education, skills, technologies, and projects sections rendered from the API.
- Contact modal with reactive form validation and backend submission.
- Public language switcher with Spanish and English support.
- Section-based portfolio navigation powered by localized text definitions from `ui-text.ts`.
- Visitor tracking with external geolocation lookup.

### Admin panel

- JWT-protected login flow.
- CRUD management for:
  - institutions
  - education
  - skills
  - technologies
  - projects
  - social networks
  - main profile
- Visitor dashboard with metrics, countries, cities, and visit traces.
- Reusable tables with search, pagination, sorting, and empty/error/loading states.
- Angular Material forms and reusable buttons with loading state support.

### Cross-cutting UX and behavior

- HTTP interceptor with `Authorization: Bearer` for authenticated requests.
- Guest and protected route guards.
- Session expiration watcher with automatic logout.
- Centralized visual notifications for success, warning, info, and error states.
- Route-level SEO title and metadata strategy.
- Scroll restoration and anchor scrolling.
- API configuration through `environment.ts` and `environment.prod.ts`.

## Technical stack

- Angular 22
- TypeScript 6
- Angular Router
- Angular Material
- RxJS
- Bootstrap 5
- `ngx-spinner`
- Vitest for unit and integration testing
- Playwright for E2E testing
- ESLint + Prettier for static quality checks
- Docker + Nginx for packaging and deployment
- GitHub Actions + GHCR for CI/CD

## Architecture

The application is organized by layers and features:

- `src/app/core`: interceptor, guards, session handling, notifications, SEO, and cross-cutting services.
- `src/app/shared`: reusable components, directives, and shared interfaces.
- `src/app/features/auth`: authentication flow.
- `src/app/features/portfolio`: public portfolio experience.
- `src/app/features/admin`: admin forms, tables, and visitor dashboard.
- `src/app/**/testing/unit`: unit tests organized by module.
- `src/app/**/testing/integration`: integration tests grouped by feature.
- `e2e`: Playwright browser flows grouped by functional domain.

Relevant technical decisions:

- route-based lazy loading for `portfolio`, `login`, and `home`
- standalone components as the project default
- `Signals` for lightweight UI state
- `ChangeDetectionStrategy.OnPush` in key components
- shared components for buttons, tables, and page headers
- centralized reusable copy to avoid duplicated strings

## Session and language behavior

- The authentication interceptor automatically attaches the token to API requests.
- Protected routes redirect to `/login` when there is no valid session.
- Expired sessions are cleared automatically.
- The public experience (`/`) supports both Spanish and English.
- The authenticated area stays in English for admin management.

## Backend integration

Configured environments:

- Development: `http://localhost:9090/api`
- Production: `https://www.api.keax.dev/api`

External service used for visitor tracking:

- Geolocation: `https://ip.guide`

## Requirements

- Node.js `^22.22.3 || ^24.15.0 || ^26.0.0`
- npm compatible with the installed Node version
- Docker Desktop or Docker Engine if you want to run the image locally

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
- Integration: real collaboration between `HttpClient`, Router, services, and key components.
- E2E: full browser flows validated with Playwright.

Current test organization:

- `src/app/core/testing/unit`
- `src/app/shared/testing/unit`
- `src/app/features/auth/testing/unit`
- `src/app/features/auth/testing/integration`
- `src/app/features/admin/testing/unit`
- `src/app/features/portfolio/testing/unit`
- `src/app/features/portfolio/testing/integration`
- `e2e/auth`
- `e2e/admin`
- `e2e/portfolio`

Configured minimum coverage:

- Statements: `80%`
- Branches: `80%`
- Functions: `80%`
- Lines: `80%`

Important notes:

- Default E2E tests are deterministic and mock the API.
- `npm run test:e2e:live` runs a separate smoke flow against the real backend.
- In CI, Playwright keeps traces, screenshots, and video only when failures happen.

## Local Docker workflow

Manual build:

```bash
docker build -t portfolio-frontend .
docker run --rm -p 8080:80 portfolio-frontend
```

With Docker Compose:

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

Local container access:

```text
http://localhost:8080
```

## Production build

```bash
npm run build -- --configuration=production
```

Generated output:

```text
dist/frontend
```

The production build includes:

- `environment.ts` replacement with `environment.prod.ts`
- `outputHashing`
- bundle and style budgets

## CI/CD

The project uses GitHub Actions with two main workflows:

- `ci.yml`: validates formatting, lint, typecheck, unit tests, integration tests, E2E tests, and the production build.
- `deploy-prod.yml`: publishes the Docker image to GitHub Container Registry and updates the container on AWS Lightsail.

Current branch flow:

- `development`: CI only.
- `main`: CI plus production deployment if all checks pass.

Current CI pipeline:

- format verification with Prettier
- linting with Angular ESLint
- typecheck for app, tests, and E2E code
- unit tests with Vitest
- integration tests with Vitest
- E2E tests with Playwright
- final production build

## Production deployment

Current architecture:

- GitHub Actions builds the image using `Dockerfile`.
- The image is published to GHCR.
- Lightsail runs `docker compose pull` and `docker compose up -d`.
- The frontend container exposes `127.0.0.1:4201`.
- Host Nginx works as the reverse proxy for `https://www.keax.dev`.
- The remote deployment directory uses `docker-compose.prod.yml` and `.env.prod`.

Relevant files:

- `Dockerfile`: multi-stage build with Node 24 + Nginx.
- `default.conf`: Nginx configuration inside the container.
- `docker-compose.yml`: local execution.
- `docker-compose.prod.yml`: remote Lightsail execution.

Useful production checks:

```bash
docker ps
cd /opt/portfolio-frontend && docker compose --env-file .env.prod -f docker-compose.prod.yml ps
curl -I http://127.0.0.1:4201
```

Basic manual rollback path:

```bash
cd /opt/portfolio-frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml pull frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --remove-orphans
```

## Required production secrets

The deployment workflow uses the `production` GitHub environment and requires these secrets:

- `LIGHTSAIL_HOST`
- `LIGHTSAIL_USER`
- `LIGHTSAIL_SSH_KEY`
- `LIGHTSAIL_FRONTEND_PATH`
- `GHCR_READ_TOKEN`

The repository must also enable:

- `Settings > Actions > General > Workflow permissions > Read and write permissions`

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
    testing/
e2e/
public/
.github/
  workflows/
```

## Development recommendations

- Run `npm run format:check`, `npm run lint`, and `npm run typecheck` before pushing changes.
- Use `npm run test:unit` for quick iterations.
- Use `npm run test:integration` when changing authentication, routing, or HTTP services.
- Use `npm run test:e2e` to validate critical flows before closing a delivery.
- If you work on Windows, keep LF line endings enforced through `.gitattributes`.
- When deployment logic changes, validate CI in `development` before promoting the branch to `main`.

## Notes

- GitHub does not provide a native README language switcher, which is why the repository keeps both `README.md` and `README.en.md`.
- The current deployment uses SSH into Lightsail. If you want a stricter security model later, the flow can evolve toward a more restricted access pattern or a self-hosted runner.
