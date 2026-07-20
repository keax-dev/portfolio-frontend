/**
 * Utilidades compartidas por los E2E para simular contratos públicos y sesiones.
 * Centralizan respuestas representativas y evitan duplicar interceptores en cada escenario.
 */
import { Page, Route } from '@playwright/test';

const apiBase = 'http://localhost:9090/api';

export async function mockPublicPortfolio(page: Page): Promise<void> {
  // El test solo verifica la URL localizada del iframe, no carga el visor externo.
  await page.route('https://docs.google.com/**', async (route) => route.abort());

  // Simula todos los endpoints consumidos al construir la página pública.
  await page.route(`${apiBase}/**`, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path === '/api/portfolio/profile') {
      await json(
        route,
        api({
          name: 'Kevin',
          last_name: 'Galarza',
          title: 'Software Engineer',
          title_es: 'Ingeniero de Software',
          cv: 'https://example.com/cv-en.pdf',
          cv_es: 'https://example.com/cv-es.pdf',
          image: '/images/profile.jpg',
        }),
      );
      return;
    }

    if (path === '/api/portfolio/education') {
      await json(
        route,
        api([
          {
            id: 1,
            title: 'Systems Engineering',
            title_es: 'Ingeniería en Sistemas',
            place: 'Guayaquil',
            place_es: 'Guayaquil',
            start: '2020',
            start_es: '2020',
            end: '2024',
            end_es: '2024',
            position: 1,
            deleted: false,
            institution: 1,
            institution_name: 'University',
            institution_name_es: 'Universidad',
            institution_url: '/images/logo.png',
          },
        ]),
      );
      return;
    }

    if (path === '/api/portfolio/skill') {
      await json(
        route,
        api([
          {
            id: 1,
            name: 'Angular',
            position: 1,
            picture: '/images/logo.png',
          },
        ]),
      );
      return;
    }

    if (path === '/api/portfolio/project') {
      await json(
        route,
        api([
          {
            id: 1,
            title: 'Portfolio',
            title_es: 'Portafolio',
            description: 'Personal website',
            description_es: 'Sitio personal',
            images: [
              { id: 1, url: '/images/logo.png', position: 1 },
              { id: 2, url: '/images/logo.png', position: 2 },
            ],
            position: 1,
            technologies: [{ id: 1, name: 'Angular', position: 1 }],
            links: [
              {
                id: 1,
                type: 'DEPLOY',
                url: 'https://example.com',
                position: 1,
              },
            ],
          },
        ]),
      );
      return;
    }

    if (path === '/api/portfolio/socialNetwork') {
      await json(
        route,
        api([
          {
            id: 1,
            name: 'GitHub',
            icon: 'pi pi-github',
            color: '#000000',
            position: 1,
            url: 'https://github.com/example',
          },
        ]),
      );
      return;
    }

    if (path === '/api/visitor' && request.method() === 'POST') {
      await json(route, api(null));
      return;
    }

    if (path === '/api/portfolio/contact' && request.method() === 'POST') {
      await json(route, api(null, 'Message sent'));
      return;
    }

    // Hace visible cualquier contrato inesperado en vez de consultar un backend real.
    await route.fulfill({ status: 404, body: 'Unhandled mocked endpoint' });
  });
}

export async function installValidSession(page: Page): Promise<void> {
  // Inserta la sesión antes de que Angular y los guards lean sessionStorage.
  await page.addInitScript(() => {
    sessionStorage.setItem('token', 'e2e-token');
    sessionStorage.setItem('expiration', String(Date.now() + 3_600_000));
  });
}

export function api<T>(data: T, alert = ''): { status: boolean; alert: string; data: T } {
  // Mantiene el mismo envelope utilizado por todos los servicios Angular.
  return { status: true, alert, data };
}

export async function json(route: Route, body: unknown, status = 200): Promise<void> {
  // Responde como una API JSON real para conservar serialización y headers.
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}
