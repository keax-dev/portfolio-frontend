/**
 * Pruebas unitarias de geolocalización, registro y filtros temporales de visitantes.
 */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { environment } from '@src/environments/environment';
import { VisitorService } from './visitor.service';

describe('VisitorService', () => {
  const baseUrl = 'https://api.test';
  let service: VisitorService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    service = TestBed.inject(VisitorService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // Caso: resolves, trims and registers visitor location.
  it('resolves, trims and registers visitor location', () => {
    service.registerVisit('/projects').subscribe();
    http.expectOne(environment.visitorGeoUrl).flush({
      location: { country: ' Ecuador ', city: ' Guayaquil ' },
    });

    const request = http.expectOne(`${baseUrl}/visitor`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      path: '/projects',
      country: 'Ecuador',
      city: 'Guayaquil',
    });
    request.flush({ status: true, alert: 'ok', data: null });
  });

  // Caso: still registers a visit when geolocation fails.
  it('still registers a visit when geolocation fails', () => {
    service.registerVisit('/').subscribe();
    http.expectOne(environment.visitorGeoUrl).flush({}, { status: 503, statusText: 'Unavailable' });

    const request = http.expectOne(`${baseUrl}/visitor`);
    expect(request.request.body).toEqual({
      path: '/',
      country: undefined,
      city: undefined,
    });
    request.flush({ status: true, alert: 'ok', data: null });
  });

  // Caso: omits blank location values.
  it('omits blank location values', () => {
    service.registerVisit('/').subscribe();
    http.expectOne(environment.visitorGeoUrl).flush({
      location: { country: ' ', city: '' },
    });
    const request = http.expectOne(`${baseUrl}/visitor`);
    expect(request.request.body.country).toBeUndefined();
    expect(request.request.body.city).toBeUndefined();
    request.flush({ status: true, alert: 'ok', data: null });
  });

  // Caso: adds optional ranges to visitor-list requests.
  it('adds optional ranges to visitor-list requests', () => {
    service.getVisitorList('2026-01-01', '2026-01-31').subscribe();
    const request = http.expectOne(
      (req) =>
        req.url === `${baseUrl}/visitor` &&
        req.params.get('startAt') === '2026-01-01' &&
        req.params.get('endAt') === '2026-01-31',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ status: true, alert: 'ok', data: [] });
  });

  // Caso: gets dashboard data without empty query parameters.
  it('gets dashboard data without empty query parameters', () => {
    service.getDashboard().subscribe();
    const request = http.expectOne(`${baseUrl}/visitor/dashboard`);
    expect(request.request.params.keys()).toEqual([]);
    request.flush({
      status: true,
      alert: 'ok',
      data: {
        totalVisits: 0,
        uniqueVisitors: 0,
        visitsLast24Hours: 0,
        countries: [],
        cities: [],
      },
    });
  });
});
