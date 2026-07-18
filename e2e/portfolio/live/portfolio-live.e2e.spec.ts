/**
 * Smoke E2E con backend real: valida que el frontend pueda consumir los contratos públicos
 * sin mockear la API del proyecto. Solo se estabiliza la geolocalización externa.
 */
import { expect, test } from '@playwright/test';

const apiBaseUrl = 'http://localhost:9090/api';

test.describe('Live public portfolio contract', () => {
  test('loads public portfolio resources from the real backend', async ({ page, request }) => {
    let backendAvailable = false;

    try {
      const response = await request.get(`${apiBaseUrl}/portfolio/profile`);
      backendAvailable = response.ok();
    } catch {
      backendAvailable = false;
    }

    test.skip(!backendAvailable, 'El backend real no está disponible en localhost:9090.');

    await page.route('https://ip.guide/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          location: { country: 'Ecuador', city: 'Guayaquil' },
        }),
      });
    });

    const [
      profileResponse,
      educationResponse,
      skillResponse,
      projectResponse,
      socialNetworkResponse,
      visitorResponse,
    ] = await Promise.all([
      page.waitForResponse(`${apiBaseUrl}/portfolio/profile`),
      page.waitForResponse(`${apiBaseUrl}/portfolio/education`),
      page.waitForResponse(`${apiBaseUrl}/portfolio/skill`),
      page.waitForResponse(`${apiBaseUrl}/portfolio/project`),
      page.waitForResponse(`${apiBaseUrl}/portfolio/socialNetwork`),
      page.waitForResponse(`${apiBaseUrl}/visitor`),
      page.goto('/'),
    ]);

    expect(profileResponse.ok()).toBe(true);

    for (const response of [
      profileResponse,
      educationResponse,
      skillResponse,
      projectResponse,
      socialNetworkResponse,
      visitorResponse,
    ]) {
      expect(response.ok()).toBe(true);
      const body = (await response.json()) as {
        status?: boolean;
        alert?: string;
        data?: unknown;
      };

      expect(typeof body.status).toBe('boolean');
      expect(typeof body.alert).toBe('string');
      expect('data' in body).toBe(true);
    }

    const profileBody = (await profileResponse.json()) as {
      data: {
        name?: string;
        last_name?: string;
      };
    };

    const fullName = `${profileBody.data.name ?? ''} ${profileBody.data.last_name ?? ''}`.trim();
    if (fullName) {
      await expect(page.getByRole('heading', { level: 1 })).toContainText(fullName);
    }

    await expect(page.locator('main')).toBeVisible();
  });
});
