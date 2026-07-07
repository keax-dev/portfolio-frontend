/**
 * E2E administrativo representativo: crea y elimina una institución con subida de imagen.
 * Cubre tabla, diálogo, formulario, multipart, confirmación y recarga del listado.
 */
import { expect, test } from '@playwright/test';
import { api, installValidSession, json } from './support/api-mocks';

// Caso: crea y elimina una institución desde la interfaz administrativa.
test('creates and deletes an institution through the admin UI', async ({ page }) => {
  // Mantiene un pequeño estado en memoria para imitar la persistencia del backend.
  const institutions: Array<{
    id: number;
    name: string;
    name_es: string;
    url?: string;
  }> = [];
  await installValidSession(page);

  await page.route('http://localhost:9090/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path === '/api/institution' && request.method() === 'POST') {
      const payload = request.postDataJSON() as {
        name: string;
        name_es: string;
      };
      const created = { id: 1, ...payload };
      institutions.splice(0, institutions.length, created);
      await json(route, api(created, 'Institution created'));
      return;
    }

    if (path === '/api/institution') {
      await json(route, api(institutions));
      return;
    }

    if (path === '/api/image/institution/1' && request.method() === 'POST') {
      institutions[0] = { ...institutions[0], url: '/images/logo.png' };
      await json(route, api(institutions[0], 'Image uploaded'));
      return;
    }

    if (path === '/api/institution/1' && request.method() === 'DELETE') {
      institutions.splice(0);
      await json(route, api([], 'Institution deleted'));
      return;
    }

    await route.fulfill({ status: 404, body: 'Unhandled admin endpoint' });
  });

  // Abre la tabla protegida y crea un registro desde el diálogo.
  await page.goto('/home/institution');
  await expect(page.getByRole('heading', { name: 'Management of Institutions' })).toBeVisible();
  await page.locator('app-button').getByRole('button', { name: 'Institution' }).click();
  await page.getByLabel('Name (English):').fill('OpenAI University');
  await page.getByLabel('Name (Spanish):').fill('Universidad OpenAI');
  await page.getByLabel('Image:').setInputFiles({
    name: 'institution.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake png content'),
  });
  await page.getByRole('button', { name: 'Save' }).click({ force: true });

  // La tabla recargada debe contener la entidad persistida.
  await expect(page.getByText('OPENAI UNIVERSITY')).toBeVisible();
  await expect(page.getByText('Image uploaded')).toBeVisible();

  // Elimina usando el diálogo real de confirmación.
  await page.getByRole('button', { name: 'Delete record' }).click();
  await expect(page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // El listado final y la notificación deben reflejar la eliminación.
  await expect(page.getByText('Institution deleted')).toBeVisible();
  await expect(page.getByText('There are no records.')).toBeVisible();
  await expect(page.getByText('OPENAI UNIVERSITY')).toBeHidden();
});
