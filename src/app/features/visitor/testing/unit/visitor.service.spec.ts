import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { environment } from '@src/environments/environment';

describe('VisitorService', () => {
  const baseUrl = environment.url;
  let service: VisitorService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VisitorService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('registers the resolved visitor location with the visited path', () => {
    service.registerVisit('/projects').subscribe();
    const geoRequest = http.expectOne(environment.visitorGeoUrl);
    expect(geoRequest.request.method).toBe('GET');
    geoRequest.flush({
      ip: '203.0.113.10',
      location: {
        country: 'Ecuador',
        city: 'Quito',
      },
    });

    const request = http.expectOne(`${baseUrl}/visitor`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      path: '/projects',
      ip: '203.0.113.10',
      country: 'Ecuador',
      city: 'Quito',
    });
    request.flush({ status: true, alert: 'ok', data: null });
  });

  it('skips backend registration for the owner IP range', () => {
    let completed = false;

    service.registerVisit('/projects').subscribe({
      next: (response) => {
        expect(response.data).toBeNull();
        completed = true;
      },
    });

    http.expectOne(environment.visitorGeoUrl).flush({
      ip: '45.70.58.27',
      location: {
        country: 'Ecuador',
        city: 'Quito',
      },
    });

    http.expectNone(`${baseUrl}/visitor`);
    expect(completed).toBe(true);
  });

  it('registers only the path when geolocation cannot be resolved', () => {
    service.registerVisit('/projects').subscribe();
    http.expectOne(environment.visitorGeoUrl).flush(null, {
      status: 503,
      statusText: 'Service Unavailable',
    });

    const request = http.expectOne(`${baseUrl}/visitor`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ path: '/projects' });
    request.flush({ status: true, alert: 'ok', data: null });
  });

  it('adds optional ranges to visitor-list requests', () => {
    service.getVisitorList('2026-01-01', '2026-01-31').subscribe();
    const request = http.expectOne(
      (candidate) =>
        candidate.url === `${baseUrl}/visitor` &&
        candidate.params.get('startAt') === '2026-01-01' &&
        candidate.params.get('endAt') === '2026-01-31',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ status: true, alert: 'ok', data: [] });
  });

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
