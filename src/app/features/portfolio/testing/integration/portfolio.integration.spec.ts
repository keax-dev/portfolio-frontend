import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { DialogService } from '@core/services/dialog.service';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { Project } from '@shared/interfaces/project';
import { environment } from '@src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

describe('Public portfolio integration', () => {
  const baseUrl = environment.url;
  let controller: HttpTestingController;
  let component: PortfolioComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NgxSpinnerService, useValue: { show: vi.fn(), hide: vi.fn() } },
        { provide: AlertService, useValue: { httpError: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn() } },
        { provide: Router, useValue: { url: '/', navigate: vi.fn().mockResolvedValue(true) } },
      ],
    }).compileComponents();
    component = TestBed.createComponent(PortfolioComponent).componentInstance;
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('combines and orders all public API resources', () => {
    component.getInformation();
    controller.expectOne(`${baseUrl}/portfolio/profile`).flush(
      api({
        name: 'Kevin',
        last_name: 'Galarza',
        title: 'Engineer',
        title_es: 'Ingeniero',
        cv: 'https://example.com/cv-en.pdf',
        cv_es: 'https://example.com/cv-es.pdf',
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
        { id: 2, name: 'LinkedIn', icon: '', color: '', position: 2, url: '' },
        { id: 1, name: 'GitHub', icon: '', color: '', position: 1, url: '' },
      ]),
    );

    expect(component.educationList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.skillList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList()[0].technologies.map((item) => item.position)).toEqual([1, 2]);
    expect(component.socialNetworkList().map((item) => item.position)).toEqual([1, 2]);
  });

  it('posts the visit path without contacting an external geolocation service', () => {
    component.registerVisit();
    const request = controller.expectOne(`${baseUrl}/visitor`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ path: '/' });
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

  function project(position: number): Project {
    return {
      id: position,
      title: `Project ${position}`,
      title_es: `Proyecto ${position}`,
      description: 'Description',
      description_es: 'Descripción',
      images: [],
      position,
      technologies: [
        { relation_id: 2, id: 2, name: 'Laravel', position: 2 },
        { relation_id: 1, id: 1, name: 'Angular', position: 1 },
      ],
      links: [],
    };
  }
});
