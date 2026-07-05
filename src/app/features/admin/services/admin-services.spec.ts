/**
 * Pruebas unitarias de todos los contratos CRUD y multipart del módulo administrativo.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SocialNetworkService } from './social-network.service';
import { SocialNetworkPayload } from '@shared/interfaces/social-network';
import { InstitutionService } from './institution.service';
import { InstitutionPayload } from '@shared/interfaces/institution';
import { provideHttpClient } from '@angular/common/http';
import { TechnologyPayload } from '@shared/interfaces/technology';
import { TechnologyService } from './technology.service';
import { EducationPayload } from '@shared/interfaces/education';
import { EducationService } from './education.service';
import { ProfilePayload } from '@shared/interfaces/profile';
import { ProjectPayload } from '@shared/interfaces/project';
import { ProfileService } from './profile.service';
import { ProjectService } from './project.service';
import { SkillService } from './skill.service';
import { ImageService } from './images.service';
import { SkillPayload } from '@shared/interfaces/skill';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { TestBed } from '@angular/core/testing';

describe('admin HTTP services', () => {
  const baseUrl = 'https://api.test/api';
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // Caso: uses the education CRUD contract.
  it('uses the education CRUD contract', () => {
    const service = TestBed.inject(EducationService);
    const payload: EducationPayload = {
      title: 'Degree',
      title_es: 'Título',
      institution: 2,
      place: 'City',
      start: '2020',
      start_es: '2020',
      end: '2024',
      end_es: '2024',
      position: 1,
    };

    service.getEducationListByDeleted(true).subscribe();
    expectRequest('GET', `${baseUrl}/education/by-deleted/true`);
    service.createEducation(payload).subscribe();
    expectRequest('POST', `${baseUrl}/education`, payload);
    service.updateEducation(7, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/education/7`, payload);
    service.deleteEducation(7).subscribe();
    expectRequest('DELETE', `${baseUrl}/education/7`);
  });

  // Caso: uses the institution CRUD contract.
  it('uses the institution CRUD contract', () => {
    const service = TestBed.inject(InstitutionService);
    const payload: InstitutionPayload = { name: 'University', name_es: 'Universidad' };

    service.getInstitutionListByDeleted().subscribe();
    expectRequest('GET', `${baseUrl}/institution/by-deleted/false`);
    service.createInstitution(payload).subscribe();
    expectRequest('POST', `${baseUrl}/institution`, payload);
    service.updateInstitution(4, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/institution/4`, payload);
    service.deleteInstitution(4).subscribe();
    expectRequest('DELETE', `${baseUrl}/institution/4`);
  });

  // Caso: uses the project CRUD contract.
  it('uses the project CRUD contract', () => {
    const service = TestBed.inject(ProjectService);
    const payload: ProjectPayload = {
      title: 'Portfolio',
      title_es: 'Portafolio',
      description: 'Description',
      description_es: 'Descripción',
      deploy: 'https://example.com',
      github: 'https://github.com/example',
      position: 1,
      technology: 3,
    };

    service.getProjectListByDeleted().subscribe();
    expectRequest('GET', `${baseUrl}/project/by-deleted/false`);
    service.createProject(payload).subscribe();
    expectRequest('POST', `${baseUrl}/project`, payload);
    service.updateProject(9, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/project/9`, payload);
    service.deleteProject(9).subscribe();
    expectRequest('DELETE', `${baseUrl}/project/9`);
  });

  // Caso: uses the skill CRUD contract.
  it('uses the skill CRUD contract', () => {
    const service = TestBed.inject(SkillService);
    const payload: SkillPayload = { name: 'Angular', position: 2 };

    service.getSkillListByDeleted(true).subscribe();
    expectRequest('GET', `${baseUrl}/skill/by-deleted/true`);
    service.createSkill(payload).subscribe();
    expectRequest('POST', `${baseUrl}/skill`, payload);
    service.updateSkill(3, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/skill/3`, payload);
    service.deleteSkill(3).subscribe();
    expectRequest('DELETE', `${baseUrl}/skill/3`);
  });

  // Caso: uses the technology CRUD contract.
  it('uses the technology CRUD contract', () => {
    const service = TestBed.inject(TechnologyService);
    const payload: TechnologyPayload = { name: 'Angular', position: 1 };

    service.getTechnologyListByDeleted().subscribe();
    expectRequest('GET', `${baseUrl}/technology/by-deleted/false`);
    service.createTechnology(payload).subscribe();
    expectRequest('POST', `${baseUrl}/technology`, payload);
    service.updateTechnology(5, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/technology/5`, payload);
    service.deleteTechnology(5).subscribe();
    expectRequest('DELETE', `${baseUrl}/technology/5`);
  });

  // Caso: uses the social-network CRUD contract.
  it('uses the social-network CRUD contract', () => {
    const service = TestBed.inject(SocialNetworkService);
    const payload: SocialNetworkPayload = {
      name: 'GitHub',
      icon: 'github',
      color: '#000000',
      position: 1,
      url: 'https://github.com/example',
    };

    service.getSocialNetworkListByDeleted().subscribe();
    expectRequest('GET', `${baseUrl}/socialNetwork/by-deleted/false`);
    service.createSocialNetwork(payload).subscribe();
    expectRequest('POST', `${baseUrl}/socialNetwork`, payload);
    service.updateSocialNetwork(8, payload).subscribe();
    expectRequest('PUT', `${baseUrl}/socialNetwork/8`, payload);
    service.deleteSocialNetwork(8).subscribe();
    expectRequest('DELETE', `${baseUrl}/socialNetwork/8`);
  });

  // Caso: uses the profile API contract.
  it('uses the profile API contract', () => {
    const service = TestBed.inject(ProfileService);
    const payload: ProfilePayload = {
      name: 'Kevin',
      last_name: 'Galarza',
      title: 'Engineer',
      title_es: 'Ingeniero',
      cv: 'https://example.com/cv.pdf',
    };

    service.getProfile().subscribe();
    expectRequest('GET', `${baseUrl}/profile`);
    service.createProfile(payload).subscribe();
    expectRequest('POST', `${baseUrl}/profile`, payload);
    service.updateProfile(payload).subscribe();
    expectRequest('PUT', `${baseUrl}/profile`, payload);
  });

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each([
    ['institution', 4],
    ['skill', 5],
    ['project', 6],
  ] as const)('uploads a %s image as FormData', (resource, id) => {
    const service = TestBed.inject(ImageService);
    const file = new File(['image'], 'image.png', { type: 'image/png' });

    if (resource === 'institution') service.uploadImageInstitution(id, file).subscribe();
    if (resource === 'skill') service.uploadImageSkill(id, file).subscribe();
    if (resource === 'project') service.uploadImageProject(id, file).subscribe();

    const request = http.expectOne(`${baseUrl}/image/${resource}/${id}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeInstanceOf(FormData);
    expect((request.request.body as FormData).get('image')).toBe(file);
    request.flush({ status: true, alert: 'ok', data: {} });
  });

  // Caso: uploads the profile image without an identifier.
  it('uploads the profile image without an identifier', () => {
    const service = TestBed.inject(ImageService);
    const file = new File(['image'], 'profile.jpg', { type: 'image/jpeg' });
    service.uploadImageProfile(file).subscribe();

    const request = http.expectOne(`${baseUrl}/image/profile`);
    expect(request.request.method).toBe('POST');
    expect((request.request.body as FormData).get('image')).toBe(file);
    request.flush({ status: true, alert: 'ok', data: {} });
  });

  function expectRequest(method: string, url: string, body?: unknown): void {
    const request = http.expectOne(url);
    expect(request.request.method).toBe(method);
    if (body !== undefined) expect(request.request.body).toEqual(body);
    request.flush({ status: true, alert: 'ok', data: {} });
  }
});
