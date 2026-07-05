/**
 * E2E del portafolio público: carga de contenido, traducción y formulario de contacto.
 * Los casos operan sobre la aplicación compilada y eventos reales del navegador.
 */
import { expect, test } from '@playwright/test';
import { mockPublicPortfolio } from './support/api-mocks';

test.describe('Public portfolio', () => {
  test.beforeEach(async ({ page }) => {
    // Prepara contratos deterministas antes de abrir la aplicación.
    await mockPublicPortfolio(page);
  });

  // Caso: renders API content and changes the active language.
  test('renders API content and changes the active language', async ({ page }) => {
    // Navega por la aplicación real y espera el perfil devuelto por la API simulada.
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kevin Galarza' })).toBeVisible();

    // Comprueba que las secciones principales y sus datos estén renderizados.
    await expect(page.getByRole('heading', { name: 'Educación' })).toBeVisible();
    await expect(page.getByText('Angular', { exact: true })).toBeVisible();
    await expect(page.getByText('Frontend', { exact: true })).toBeVisible();
    await expect(page.locator('#portfolio-title')).toHaveText('Portafolio');

    // Cambia el idioma desde la navegación y verifica contenido derivado del signal.
    await page.getByTitle('English').click();
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(page.locator('#home').getByText('Software Engineer')).toBeVisible();
    await expect(page.getByTitle('English')).toHaveAttribute('aria-pressed', 'true');
  });

  // Caso: validates and submits the contact dialog end to end.
  test('validates and submits the contact dialog end to end', async ({ page }) => {
    // Abre el menú y luego el diálogo CDK de contacto.
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.getByLabel('Primary navigation').getByRole('button', { name: 'Contacto' }).click();
    await expect(page.getByRole('heading', { name: 'Contactame' })).toBeVisible();

    // Intenta enviar vacío para comprobar validación y accesibilidad del formulario.
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('alert')).toHaveCount(3);

    // Completa los controles y envía el contrato al servicio real.
    await page.getByLabel('Nombre:').fill('Ada Lovelace');
    await page.getByLabel('Email:').fill('ADA@EXAMPLE.COM');
    await page.getByLabel('Mensaje:').fill('Hello from Playwright');
    await page.getByRole('button', { name: 'Send' }).click();

    // La respuesta debe cerrar el diálogo y mostrar la notificación global.
    await expect(page.getByText('Message sent')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contactame' })).toBeHidden();
  });
});
