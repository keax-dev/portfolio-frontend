/**
 * Pruebas unitarias de endpoints públicos y envío del formulario de contacto.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PortfolioService } from './portfolio.service';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { TestBed } from '@angular/core/testing';

describe('PortfolioService', () => {
  const baseUrl = 'https://api.test';
  let service: PortfolioService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    service = TestBed.inject(PortfolioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each(['profile', 'education', 'skill', 'technology', 'socialNetwork'])(
    'gets public %s information',
    (resource) => {
      const calls: Record<string, () => void> = {
        profile: () => service.getProfile().subscribe(),
        education: () => service.getEducation().subscribe(),
        skill: () => service.getSkill().subscribe(),
        technology: () => service.getTechnology().subscribe(),
        socialNetwork: () => service.getSocialNetwork().subscribe(),
      };

      calls[resource]();
      const request = http.expectOne(`${baseUrl}/portfolio/${resource}`);
      expect(request.request.method).toBe('GET');
      request.flush({ status: true, alert: 'ok', data: {} });
    },
  );

  // Caso: envía el formulario de contacto.
  it('posts the contact form', () => {
    const form = { name: 'Ada', email: 'ada@example.com', message: 'Hello!' };
    service.sendEmail(form).subscribe();
    const request = http.expectOne(`${baseUrl}/portfolio/contact`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(form);
    request.flush({ status: true, alert: 'Sent', data: null });
  });
});
