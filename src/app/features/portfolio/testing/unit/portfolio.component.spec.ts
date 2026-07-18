/**
 * Pruebas unitarias de carga, ordenamiento y recuperación de errores del portafolio.
 */
import { firstValueFrom, of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ParameterService } from '@core/services/parameter.service';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { VisitorService } from '@features/portfolio/services/visitor.service';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/interfaces/education';
import { Project } from '@shared/interfaces/project';
import { Router } from '@angular/router';
import { Skill } from '@shared/interfaces/skill';

describe('PortfolioComponent', () => {
  let fixture: ComponentFixture<PortfolioComponent>;
  let component: PortfolioComponent;
  let portfolio: {
    getProfile: ReturnType<typeof vi.fn>;
    getEducation: ReturnType<typeof vi.fn>;
    getSkill: ReturnType<typeof vi.fn>;
    getProject: ReturnType<typeof vi.fn>;
    getSocialNetwork: ReturnType<typeof vi.fn>;
  };
  let visitor: { registerVisit: ReturnType<typeof vi.fn> };
  let spinner: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  let alert: { httpError: ReturnType<typeof vi.fn> };
  let parameter: { openDialog: ReturnType<typeof vi.fn> };
  let router: {
    url: string;
    navigate: ReturnType<typeof vi.fn>;
  };

  const api = <T>(data: T, status = true) => ({
    status,
    alert: '',
    data,
  });

  beforeEach(async () => {
    portfolio = {
      getProfile: vi.fn(),
      getEducation: vi.fn(),
      getSkill: vi.fn(),
      getProject: vi.fn(),
      getSocialNetwork: vi.fn(),
    };
    visitor = { registerVisit: vi.fn().mockReturnValue(of(api(null))) };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { httpError: vi.fn() };
    parameter = {
      openDialog: vi.fn().mockReturnValue({ afterClosed: () => of(false) }),
    };
    router = { url: '/projects', navigate: vi.fn().mockResolvedValue(true) };

    portfolio.getProfile.mockReturnValue(
      of(
        api({
          name: 'Kevin',
          last_name: 'Galarza',
          title: 'Engineer',
          title_es: 'Ingeniero',
          cv: 'https://example.com/cv.pdf',
        }),
      ),
    );
    portfolio.getEducation.mockReturnValue(of(api([])));
    portfolio.getSkill.mockReturnValue(of(api([])));
    portfolio.getProject.mockReturnValue(of(api([])));
    portfolio.getSocialNetwork.mockReturnValue(of(api([])));

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolio },
        { provide: VisitorService, useValue: visitor },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
        { provide: ParameterService, useValue: parameter },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
  });

  // Caso: carga cada recurso público y oculta el spinner al completar.
  it('loads every public resource and hides the spinner on completion', () => {
    component.getInformation();

    expect(spinner.show).toHaveBeenCalledOnce();
    expect(portfolio.getProfile).toHaveBeenCalledOnce();
    expect(portfolio.getEducation).toHaveBeenCalledOnce();
    expect(portfolio.getSkill).toHaveBeenCalledOnce();
    expect(portfolio.getProject).toHaveBeenCalledOnce();
    expect(portfolio.getSocialNetwork).toHaveBeenCalledOnce();
    expect(spinner.hide).toHaveBeenCalledOnce();
  });

  // Caso: ordena educación, habilidades y redes sociales sin mutar los arreglos de la API.
  it('sorts education, skills and social networks without mutating API arrays', () => {
    const education = [educationItem(2), educationItem(1)];
    const skills: Skill[] = [
      { id: 2, name: 'RxJS', position: 2 },
      { id: 1, name: 'Angular', position: 1 },
    ];
    const networks: SocialNetwork[] = [
      { id: 2, name: 'LinkedIn', icon: '', color: '', position: 2, url: '' },
      { id: 1, name: 'GitHub', icon: '', color: '', position: 1, url: '' },
    ];
    portfolio.getEducation.mockReturnValue(of(api(education)));
    portfolio.getSkill.mockReturnValue(of(api(skills)));
    portfolio.getSocialNetwork.mockReturnValue(of(api(networks)));

    component.uploadEducation().subscribe();
    component.uploadSkill().subscribe();
    component.uploadSocialNetwork().subscribe();

    expect(component.educationList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.skillList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.socialNetworkList().map((item) => item.position)).toEqual([1, 2]);
    expect(education.map((item) => item.position)).toEqual([2, 1]);
  });

  // Caso: ordena tecnologías y cada lista anidada de proyectos.
  it('sorts projects and their nested technologies and links', () => {
    const projects = [projectItem(2), projectItem(1)];
    projects[1].technologies = [
      { id: 2, name: 'Laravel', position: 2 },
      { id: 1, name: 'Angular', position: 1 },
    ];
    projects[1].links = [
      { type: 'GITHUB_BACKEND', url: 'https://github.com/example/api', position: 2 },
      { type: 'DEPLOY', url: 'https://example.com', position: 1 },
    ];
    portfolio.getProject.mockReturnValue(of(api(projects)));

    component.uploadProject().subscribe();

    expect(component.projectList().map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList()[0].technologies.map((item) => item.position)).toEqual([1, 2]);
    expect(component.projectList()[0].links.map((item) => item.position)).toEqual([1, 2]);
  });

  // Caso: mantiene el estado existente cuando el estado de la respuesta API es false.
  it('keeps existing state when an API response status is false', () => {
    portfolio.getSkill.mockReturnValue(of(api([{ name: 'Ignored', position: 1 }], false)));
    component.uploadSkill().subscribe();
    expect(component.skillList()).toEqual([]);
  });

  // Caso: convierte respuestas vacías 400 del backend en valores regulares.
  it('converts backend 400 empty responses into regular values', async () => {
    const response = api<Skill[]>([], false);
    const error = new HttpErrorResponse({ status: 400, error: response });
    await expect(firstValueFrom(component.infoEmpty<Skill[]>(error))).resolves.toEqual(response);
  });

  // Caso: relanza errores distintos de 400.
  it('rethrows non-400 errors', async () => {
    const error = new HttpErrorResponse({ status: 500 });
    await expect(firstValueFrom(component.infoEmpty(error))).rejects.toBe(error);
  });

  // Caso: reporta un fallo al cargar información pública.
  it('reports a public-information failure', () => {
    const failure = new HttpErrorResponse({ status: 500 });
    portfolio.getProfile.mockReturnValue(throwError(() => failure));
    component.getInformation();
    expect(alert.httpError).toHaveBeenCalledWith(failure);
  });

  // Caso: registra la ruta actual e ignora fallos de analítica.
  it('registers the current route and ignores analytics failures', () => {
    visitor.registerVisit.mockReturnValue(throwError(() => new Error('blocked')));
    expect(() => component.registerVisit()).not.toThrow();
    expect(visitor.registerVisit).toHaveBeenCalledWith('/projects');
  });

  // Caso: vuelve al home después de completar el diálogo de contacto.
  it('returns home after a completed contact dialog', () => {
    parameter.openDialog.mockReturnValue({ afterClosed: () => of(true) });
    component.modalContact();
    expect(router.navigate).toHaveBeenCalledWith(['/'], { fragment: 'home' });
  });

  function educationItem(position: number): Education {
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

  function projectItem(position: number): Project {
    return {
      id: position,
      title: `Project ${position}`,
      title_es: `Proyecto ${position}`,
      description: 'Description',
      description_es: 'Descripción',
      position,
      technologies: [{ id: 1, name: 'Angular', position: 1 }],
      links: [],
    };
  }
});
