/**
 * E2E administrativo representativo: crea y elimina una institución con subida de imagen.
 * Cubre tabla, diálogo, formulario, multipart, confirmación y recarga del listado.
 */
import { expect, test } from '@playwright/test';
import { api, installValidSession, json } from '../support/api-mocks';

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
  await expect(page.getByRole('heading', { name: 'Institutions' })).toBeVisible();
  await page.locator('app-button').getByRole('button', { name: 'New Institution' }).click();
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

test('removes the selected project technology and submits its reordered relations', async ({
  page,
}) => {
  await installValidSession(page);
  const technologies = [
    { id: 1, name: 'Angular' },
    { id: 3, name: 'Laravel' },
    { id: 4, name: 'Spring Boot' },
    { id: 5, name: 'PostgreSQL' },
    { id: 6, name: 'MySQL' },
  ];
  const project = {
    id: 1,
    title: 'Courier Operations Platform',
    title_es: 'Plataforma de Operaciones Courier',
    description: 'Courier operations',
    description_es: 'Operaciones courier',
    images: [{ id: 1, url: '/images/logo.png', position: 1 }],
    position: 1,
    technologies: [
      { relation_id: 1, id: 1, name: 'Angular', position: 1 },
      { relation_id: 9, id: 3, name: 'Laravel', position: 2 },
      { relation_id: 12, id: 6, name: 'MySQL', position: 5 },
      { relation_id: 13, id: 4, name: 'Spring Boot', position: 3 },
      { relation_id: 14, id: 5, name: 'PostgreSQL', position: 4 },
    ],
    links: [],
  };
  let submittedTechnologies: unknown;

  await page.route('http://localhost:9090/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path === '/api/project/1' && request.method() === 'PUT') {
      const payload = request.postDataJSON() as { technologies: unknown };
      submittedTechnologies = payload.technologies;
      await json(route, api({ ...project, ...payload }, 'Project updated'));
      return;
    }

    if (path === '/api/project') {
      await json(route, api([project]));
      return;
    }

    if (path === '/api/technology') {
      await json(route, api(technologies));
      return;
    }

    await route.fulfill({ status: 404, body: 'Unhandled admin endpoint' });
  });

  await page.goto('/home/project');
  await page.getByRole('button', { name: 'Edit record' }).click();
  const form = page.locator('app-frm-project');
  const technologyRows = form.locator('fieldset[formarrayname="technologies"]');
  await expect(technologyRows.getByRole('button', { name: /^Remove technology/ })).toHaveCount(5);
  await expect(technologyRows.getByText('MySQL', { exact: true })).toBeVisible();

  await technologyRows.getByRole('button', { name: 'Remove technology 3' }).click();

  await expect(technologyRows.getByRole('button', { name: /^Remove technology/ })).toHaveCount(4);
  await expect(technologyRows.getByText('MySQL', { exact: true })).toHaveCount(0);
  const orderInputs = technologyRows.locator('input[formcontrolname="position"]');
  for (const [index, position] of [4, 3, 2, 1].entries()) {
    await orderInputs.nth(index).fill(String(position));
  }
  await form.getByRole('button', { name: 'Save' }).click({ force: true });

  await expect
    .poll(() => submittedTechnologies)
    .toEqual([
      { relation_id: 1, id: 1, position: 4 },
      { relation_id: 9, id: 3, position: 3 },
      { relation_id: 13, id: 4, position: 2 },
      { relation_id: 14, id: 5, position: 1 },
    ]);
});
