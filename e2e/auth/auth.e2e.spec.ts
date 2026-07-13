/**
 * E2E de autenticación: protección de rutas, login real, persistencia, logout y expiración.
 * Verifica los límites de seguridad desde URLs y localStorage observables por el usuario.
 */
import { expect, test } from '@playwright/test';
import { api, json, mockPublicPortfolio } from '../support/api-mocks';

test.describe('Authentication lifecycle', () => {
  // Caso: redirige a los usuarios anónimos fuera del área administrativa.
  test('redirects anonymous users away from the admin area', async ({ page }) => {
    // Solicita directamente una URL protegida sin preparar localStorage.
    await page.goto('/home');

    // El guard debe terminar en login y comunicar por qué ocurrió.
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('You must sign in to continue')).toBeVisible();
  });

  // Caso: inicia sesión, carga el dashboard, envía el bearer token y cierra sesión.
  test('logs in, sends the bearer token and logs out', async ({ page }) => {
    let authorizationHeader: string | undefined;

    // Simula el endpoint de login con un JWT válido durante una hora.
    await page.route('http://localhost:9090/api/**', async (route) => {
      const request = route.request();
      const path = new URL(request.url()).pathname;

      if (path === '/api/auth/login' && request.method() === 'POST') {
        const expiration = Math.floor(Date.now() / 1000) + 3_600;
        const payload = Buffer.from(JSON.stringify({ exp: expiration })).toString('base64url');
        await json(route, api({ token: `header.${payload}.signature` }, 'Welcome'));
        return;
      }

      if (path === '/api/visitor/dashboard') {
        authorizationHeader = request.headers()['authorization'];
        await json(
          route,
          api({
            totalVisits: 5,
            uniqueVisitors: 3,
            visitsLast24Hours: 1,
            countries: [{ country: 'Ecuador', total: 4 }],
            cities: [{ city: 'Guayaquil', total: 2 }],
          }),
        );
        return;
      }

      if (path === '/api/visitor' && request.method() === 'GET') {
        authorizationHeader = request.headers()['authorization'];
        await json(
          route,
          api([
            {
              id: 1,
              ip: '203.0.113.25',
              country: 'Ecuador',
              city: 'Guayaquil',
              path: '/portfolio',
              userAgent: 'Playwright',
              visitedAt: '2026-07-13T12:00:00.000Z',
            },
          ]),
        );
        return;
      }

      await route.fulfill({ status: 404, body: 'Unhandled auth endpoint' });
    });

    // Completa el formulario real y espera la nueva navegación protegida al dashboard.
    await page.goto('/login');
    await page.getByLabel('Username:').fill('admin');
    await page.getByLabel('Password:').fill('secret');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/home\/visitor-dashboard$/);
    await expect(page.getByRole('heading', { name: 'Visitor Dashboard' })).toBeVisible();
    await expect(page.getByText('Total visits in range')).toBeVisible();

    // Confirma persistencia y uso efectivo del token por el interceptor en el dashboard.
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeTruthy();
    expect(authorizationHeader).toMatch(/^Bearer /);

    // Prepara endpoints públicos requeridos al volver al portafolio y cierra sesión.
    await mockPublicPortfolio(page);
    await page.getByRole('button', { name: 'Log Out' }).click();
    await expect(page).toHaveURL('/');
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });

  // Caso: limpia una sesión expirada y vuelve al login.
  test('clears an expired session and returns to login', async ({ page }) => {
    // Inserta credenciales expiradas antes del bootstrap Angular.
    await page.addInitScript(() => {
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('expiration', String(Date.now() - 1));
    });

    await page.goto('/home');

    // La navegación debe limpiar storage y mostrar el mensaje específico de expiración.
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('Session expired')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  });
});
