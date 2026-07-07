/**
 * Pruebas de integración del TitleStrategy personalizado y las meta etiquetas SEO.
 */
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AppTitleStrategy } from '@core/seo/app-title.strategy';
import { Meta, Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-portfolio-stub',
  standalone: true,
  template: '<h1>Portfolio page</h1>',
})
class PortfolioStubComponent {}

@Component({ selector: 'app-login-stub', standalone: true, template: '<h1>Login page</h1>' })
class LoginStubComponent {}

describe('AppTitleStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            title: 'Portfolio',
            data: { description: 'Portfolio description' },
            component: PortfolioStubComponent,
          },
          {
            path: 'login',
            title: 'Login',
            data: { description: 'Login description' },
            component: LoginStubComponent,
          },
        ]),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
      ],
    });
  });

  afterEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  // Caso: actualiza title, description y canonical según la ruta activa.
  it('updates document SEO tags from route title and description', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');

    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);
    const canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    expect(title.getTitle()).toBe('Kevin | Login');
    expect(meta.getTag('name="description"')?.content).toBe('Login description');
    expect(meta.getTag('property="og:title"')?.content).toBe('Kevin | Login');
    expect(meta.getTag('name="twitter:description"')?.content).toBe('Login description');
    expect(canonical?.href).toMatch(/\/login$/);
  });
});
