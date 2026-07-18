/**
 * Pruebas de integración de PortfolioComponent con PortfolioService y VisitorService reales.
 * Validan la composición de múltiples respuestas HTTP y el registro geográfico de visitas.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { provideHttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('Public portfolio integration', () => {
  const baseUrl = environment.url;
  const visitorGeoUrl = environment.visitorGeoUrl;
  let controller: HttpTestingController;
  let component: PortfolioComponent;

  beforeEach(async () => {
    // Usa servicios HTTP reales y mocks solamente para UI, Router y dialogs.
    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: NgxSpinnerService,
          useValue: { show: vi.fn(), hide: vi.fn() },
        },
        { provide: AlertService, useValue: { httpError: vi.fn() } },
        { provide: ParameterService, useValue: { openDialog: vi.fn() } },
        {
          provide: Router,
          useValue: { url: '/', navigate: vi.fn().mockResolvedValue(true) },
        },
      ],
    }).compileComponents();
    component = TestBed.createComponent(PortfolioComponent).componentInstance;
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  // Caso: combina y ordena todos los recursos públicos de la API.
  it('combines and orders all public API resources', () => {
    // Inicia el forkJoin del componente para producir las cinco solicitudes.
    component.getInformation();

    // Responde cada endpoint con datos deliberadamente desordenados.
    controller.expectOne(`${baseUrl}/portfolio/profile`).flush(
      api({
        name: 'Kevin',
        last_name: 'Galarza',
        title: 'Engineer',
        title_es: 'Ingeniero',
        cv: 'https://example.com/cv.pdf',
      }),
    );
    controller.expectOne(`${baseUrl}/portfolio/education`).flush(api([education(2), education(1)]));
    controller.expectOne(`${baseUrl}/portfolio/skill`).flush(
      api([
        { id: 2, name: 'RxJS', position: 2 },
        { id: 1, name: 'Angular', position: 1 },
      ]),
    );
    controller.expectOne(`${baseUrl}/portfolio/project`).flush(api([project(2), project(1)]));
    controller.expectOne(`${baseUrl}/portfolio/socialNetwork`).flush(
      api([
        {
          id: 2,
          name: 'LinkedIn',
          icon: '',
          color: '',
          position: 2,
          url: '',
        },
        {
          id: 1,
          name: 'GitHub',
          icon: '',
          color: '',
          position: 1,
          url: '',
        },
      ]),
    );

    // El componente debe exponer modelos consistentes y ordenados para la vista.
    expect(component.educationList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.skillList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList()[0].technologies.map((item) => item.position)).toEqual([1, 2]);
    expect(component.socialNetworkList().map((item) => item.position)).toEqual([1, 2]);
  });

  // Caso: resuelve la geolocalización antes de registrar la visita.
  it('resolves geolocation before posting the visit', () => {
    // Inicia el registro mediante VisitorService real.
    component.registerVisit();
    controller.expectOne(visitorGeoUrl).flush({
      location: { country: 'Ecuador', city: 'Guayaquil' },
    });

    // La segunda solicitud debe incorporar la ruta y ubicación resueltas.
    const request = controller.expectOne(`${baseUrl}/visitor`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      path: '/',
      country: 'Ecuador',
      city: 'Guayaquil',
    });
    request.flush(api(null));
  });

  function api<T>(data: T): { status: boolean; alert: string; data: T } {
    return { status: true, alert: '', data };
  }

  function education(position: number): object {
    return {
      id: position,
      title: 'Degree',
      title_es: 'Título',
      place: 'City',
      place_es: 'Ciudad',
      start: '2020',
      start_es: '2020',
      end: '2024',
      end_es: '2024',
      position,
      deleted: false,
      institution: 1,
      institution_name: 'University',
      institution_name_es: 'Universidad',
      institution_url: '',
    };
  }

  function project(position: number): object {
    return {
      id: position,
      title: `Project ${position}`,
      title_es: `Proyecto ${position}`,
      description: 'Description',
      description_es: 'Descripción',
      position,
      technologies: [
        { id: 2, name: 'Laravel', position: 2 },
        { id: 1, name: 'Angular', position: 1 },
      ],
      links: [],
    };
  }
});
