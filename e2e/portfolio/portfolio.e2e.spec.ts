/**
 * E2E del portafolio público: carga de contenido, traducción y formulario de contacto.
 * Los casos operan sobre la aplicación compilada y eventos reales del navegador.
 */
import { expect, test } from '@playwright/test';
import { mockPublicPortfolio } from '../support/api-mocks';

test.describe('Public portfolio', () => {
  test.beforeEach(async ({ page }) => {
    // Prepara contratos deterministas antes de abrir la aplicación.
    await mockPublicPortfolio(page);
  });

  // Caso: renderiza el contenido de la API y cambia el idioma activo.
  test('renders API content and changes the active language', async ({ page }) => {
    // Navega por la aplicación real y espera el perfil devuelto por la API simulada.
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kevin Galarza' })).toBeVisible();

    // El idioma inicial es español, por lo que el modal debe recibir el CV en español.
    await page.locator('#home .btn-cv').click();
    await expect(page.locator('app-cv-preview iframe')).toHaveAttribute('src', /cv-es\.pdf/);
    await page.locator('app-cv-preview').getByRole('button', { name: 'Close CV preview' }).click();

    // Comprueba que las secciones principales y sus datos estén renderizados.
    await expect(page.getByRole('heading', { name: 'Educación' })).toBeVisible();
    const projectAccordion = page.locator('.project-accordion');
    const firstProject = projectAccordion.locator('details').first();
    await expect(projectAccordion.getByText('Angular', { exact: true })).toBeVisible();
    await expect(projectAccordion.locator('summary').getByText('Portafolio')).toBeVisible();
    await expect(firstProject).toHaveAttribute('open', '');
    await firstProject.locator('summary').click();
    await expect(firstProject).not.toHaveAttribute('open', '');
    await firstProject.locator('summary').click();
    await expect(firstProject).toHaveAttribute('open', '');
    await expect(
      firstProject.getByRole('link', { name: 'Visitar sitio de Portafolio' }),
    ).toBeVisible();
    await expect(
      firstProject.getByRole('button', { name: 'Ver detalles Portafolio' }),
    ).toBeVisible();
    const projectImages = firstProject.locator('.project-images');
    await expect(projectImages.locator('.carousel-item')).toHaveCount(2);
    const [carouselBox, accordionBodyBox] = await Promise.all([
      projectImages.boundingBox(),
      firstProject.locator('.project-accordion__body').boundingBox(),
    ]);
    expect(carouselBox).not.toBeNull();
    expect(accordionBodyBox).not.toBeNull();
    expect(
      Math.abs(
        carouselBox!.x +
          carouselBox!.width / 2 -
          (accordionBodyBox!.x + accordionBodyBox!.width / 2),
      ),
    ).toBeLessThan(2);
    await expect(projectImages.locator('.carousel-item button')).toHaveCount(0);
    await projectImages.getByRole('button', { name: 'Imagen siguiente' }).click();
    await expect(projectImages.locator('.carousel-item').nth(1)).toHaveClass(/active/);

    await firstProject.getByRole('button', { name: 'Ver detalles Portafolio' }).click();
    const projectDetails = page.locator('app-project-details');
    await expect(projectDetails.locator('.project-images__stack [role="listitem"]')).toHaveCount(2);
    await expect(projectDetails.locator('.carousel')).toHaveCount(0);
    await projectDetails.locator('.project-images__stack button').first().click();
    await expect(page.locator('app-show-image')).toBeVisible();
    await page.locator('app-show-image').getByRole('button').click();
    await expect(page.locator('app-show-image')).toHaveCount(0);
    await projectDetails.getByRole('button', { name: 'Cerrar detalles del proyecto' }).click();
    await expect(page.locator('#portfolio-title')).toHaveText('Portafolio');

    // Cambia el idioma desde la navegación y verifica contenido derivado del signal.
    await page.getByTitle('English').click();
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(page.locator('#home').getByText('Software Engineer')).toBeVisible();
    await expect(page.getByTitle('English')).toHaveAttribute('aria-pressed', 'true');

    // Al cambiar a inglés, el mismo botón debe abrir el CV en inglés.
    await page.locator('#home .btn-cv').click();
    await expect(page.locator('app-cv-preview iframe')).toHaveAttribute('src', /cv-en\.pdf/);
  });

  // Caso: valida y envía el diálogo de contacto de punta a punta.
  test('validates and submits the contact dialog end to end', async ({ page }) => {
    // Abre el menú y luego el diálogo CDK de contacto.
    await page.goto('/');
    await page.locator('app-navbar .navbar-toggler').click();
    await page.locator('app-navbar').getByRole('button', { name: 'Contacto' }).click();
    await expect(page.getByRole('heading', { name: 'Contáctame' })).toBeVisible();

    // Intenta enviar vacío para comprobar validación y accesibilidad del formulario.
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByRole('alert')).toHaveCount(3);

    // Completa los controles y envía el contrato al servicio real.
    await page.getByLabel('Nombre').fill('Ada Lovelace');
    await page.getByLabel('Correo electrónico').fill('ADA@EXAMPLE.COM');
    await page.getByLabel('Mensaje').fill('Hello from Playwright');
    await page.getByRole('button', { name: 'Enviar' }).click();

    // La respuesta debe cerrar el diálogo y mostrar la notificación global.
    await expect(page.getByText('Message sent')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contáctame' })).toBeHidden();
  });
});
