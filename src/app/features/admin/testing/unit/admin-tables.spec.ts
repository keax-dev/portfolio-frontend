import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import { TableEducationComponent } from '@features/admin/pages/education/table-education/table-education.component';
import { TableInstitutionComponent } from '@features/admin/pages/institution/table-institution/table-institution.component';
import { TableProjectComponent } from '@features/admin/pages/project/table-project/table-project.component';
import { TableSkillComponent } from '@features/admin/pages/skill/table-skill/table-skill.component';
import { TableSocialNetworkComponent } from '@features/admin/pages/social-network/table-social-network/table-social-network.component';
import { TableTechnologyComponent } from '@features/admin/pages/technology/table-technology/table-technology.component';
import { EducationService } from '@features/admin/services/education.service';
import { InstitutionService } from '@features/admin/services/institution.service';
import { ProjectService } from '@features/admin/services/project.service';
import { SkillService } from '@features/admin/services/skill.service';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { TechnologyService } from '@features/admin/services/technology.service';
import { of, throwError } from 'rxjs';

interface TableCase {
  readonly name: string;
  readonly component: Type<unknown>;
  readonly serviceToken: Type<unknown>;
  readonly loadMethod: string;
  readonly deleteMethod: string;
  readonly modalMethod: string;
  readonly confirmMethod: string;
  readonly serviceLoadMethod: string;
  readonly serviceDeleteMethod: string;
  readonly record: object;
}

describe('admin table components', () => {
  const cases: readonly TableCase[] = [
    {
      name: 'institution',
      component: TableInstitutionComponent,
      serviceToken: InstitutionService,
      loadMethod: 'getInstitutionList',
      deleteMethod: 'deleteInstitution',
      modalMethod: 'modalInstitution',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getInstitutionList',
      serviceDeleteMethod: 'deleteInstitution',
      record: { id: 1, name: 'University', name_es: 'Universidad' },
    },
    {
      name: 'education',
      component: TableEducationComponent,
      serviceToken: EducationService,
      loadMethod: 'getEducationList',
      deleteMethod: 'deleteEducation',
      modalMethod: 'modalEducation',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getEducationList',
      serviceDeleteMethod: 'deleteEducation',
      record: { id: 2, position: 1, title: 'Degree' },
    },
    {
      name: 'skill',
      component: TableSkillComponent,
      serviceToken: SkillService,
      loadMethod: 'getSkillList',
      deleteMethod: 'deleteSkill',
      modalMethod: 'modalSkill',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getSkillList',
      serviceDeleteMethod: 'deleteSkill',
      record: { id: 3, name: 'Angular', position: 1 },
    },
    {
      name: 'technology',
      component: TableTechnologyComponent,
      serviceToken: TechnologyService,
      loadMethod: 'getTechnologyList',
      deleteMethod: 'deleteTechnology',
      modalMethod: 'modalTechnology',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getTechnologyList',
      serviceDeleteMethod: 'deleteTechnology',
      record: { id: 4, name: 'Angular' },
    },
    {
      name: 'project',
      component: TableProjectComponent,
      serviceToken: ProjectService,
      loadMethod: 'getProjectList',
      deleteMethod: 'deleteProject',
      modalMethod: 'modalProject',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getProjectList',
      serviceDeleteMethod: 'deleteProject',
      record: {
        id: 5,
        title: 'Portfolio',
        title_es: 'Portafolio',
        description: 'Description',
        description_es: 'Descripción',
        position: 1,
        images: [],
        technologies: [{ relation_id: 1, id: 2, name: 'Angular', position: 1 }],
        links: [],
      },
    },
    {
      name: 'social network',
      component: TableSocialNetworkComponent,
      serviceToken: SocialNetworkService,
      loadMethod: 'getSocialNetworkList',
      deleteMethod: 'deleteSocialNetwork',
      modalMethod: 'modalSocialNetwork',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getSocialNetworkList',
      serviceDeleteMethod: 'deleteSocialNetwork',
      record: { id: 6, name: 'GitHub', position: 1 },
    },
  ];

  it.each(cases)('loads, refreshes, confirms and deletes $name records', async (testCase) => {
    const load = vi.fn().mockReturnValue(of({ status: true, alert: '', data: [testCase.record] }));
    const remove = vi.fn().mockReturnValue(of({ status: true, alert: 'Deleted', data: [] }));
    const service = {
      [testCase.serviceLoadMethod]: load,
      [testCase.serviceDeleteMethod]: remove,
    };
    const dialogs = { open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }) };
    const confirmation = { confirmDelete: vi.fn().mockReturnValue(of(true)) };
    const alert = { success: vi.fn(), httpError: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [testCase.component],
      providers: [
        { provide: testCase.serviceToken, useValue: service },
        { provide: DialogService, useValue: dialogs },
        { provide: ConfirmationService, useValue: confirmation },
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();

    const component = TestBed.createComponent(testCase.component).componentInstance as {
      readonly records: () => readonly unknown[];
      readonly isLoading: () => boolean;
      readonly loadErrorMessage: () => string;
    } & Record<string, unknown>;

    invoke(component, testCase.loadMethod);
    expect(component.records()).toEqual([testCase.record]);
    expect(component.isLoading()).toBe(false);
    expect(component.loadErrorMessage()).toBe('');

    invoke(component, testCase.modalMethod, testCase.record);
    expect(dialogs.open).toHaveBeenCalled();
    expect(load).toHaveBeenCalledTimes(2);

    invoke(component, testCase.confirmMethod, testCase.record);
    expect(confirmation.confirmDelete).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith((testCase.record as { readonly id: number }).id);
    expect(alert.success).toHaveBeenCalledWith('Deleted');
    expect(load).toHaveBeenCalledTimes(3);
  });

  it('exposes a stable error state when a list cannot be loaded', async () => {
    const failure = new Error('offline');
    const alert = { success: vi.fn(), httpError: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [TableTechnologyComponent],
      providers: [
        {
          provide: TechnologyService,
          useValue: {
            getTechnologyList: vi.fn().mockReturnValue(throwError(() => failure)),
            deleteTechnology: vi.fn(),
          },
        },
        { provide: DialogService, useValue: { open: vi.fn() } },
        { provide: ConfirmationService, useValue: { confirmDelete: vi.fn() } },
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(TableTechnologyComponent).componentInstance;
    component.getTechnologyList();
    expect(component.records()).toEqual([]);
    expect(component.loadErrorMessage()).not.toBe('');
    expect(alert.httpError).toHaveBeenCalledWith(failure);
  });

  it('formats project technologies, links and images for the project table', async () => {
    const records = [
      {
        id: 1,
        images: [{ id: 1, url: 'project.png', position: 1 }],
        title: 'Portfolio',
        title_es: 'Portafolio',
        description: 'Description',
        description_es: 'Descripción',
        position: 1,
        technologies: [
          { relation_id: 1, id: 2, name: 'Angular', position: 1 },
          { relation_id: 2, id: 3, name: 'Spring Boot', position: 2 },
        ],
        links: [{ id: 1, type: 'DEPLOY' as const, url: 'https://example.com', position: 1 }],
      },
    ];
    await TestBed.configureTestingModule({
      imports: [TableProjectComponent],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            getProjectList: vi.fn().mockReturnValue(of({ status: true, alert: '', data: records })),
          },
        },
        { provide: DialogService, useValue: { open: vi.fn() } },
        { provide: ConfirmationService, useValue: { confirmDelete: vi.fn() } },
        { provide: AlertService, useValue: { success: vi.fn(), httpError: vi.fn() } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(TableProjectComponent).componentInstance;
    component.getProjectList();
    expect(component.tableRecords()[0]).toMatchObject({
      technology_names: 'Angular, Spring Boot',
      link_types: 'DEPLOY',
      image_count: 1,
      preview_image: 'project.png',
    });
  });

  it('shows only the name column in technology management', async () => {
    await TestBed.configureTestingModule({
      imports: [TableTechnologyComponent],
      providers: [
        {
          provide: TechnologyService,
          useValue: {
            getTechnologyList: vi.fn().mockReturnValue(of({ status: true, data: [], alert: '' })),
          },
        },
        { provide: DialogService, useValue: { open: vi.fn() } },
        { provide: ConfirmationService, useValue: { confirmDelete: vi.fn() } },
        { provide: AlertService, useValue: { httpError: vi.fn() } },
      ],
    }).compileComponents();
    expect(TestBed.createComponent(TableTechnologyComponent).componentInstance.columns).toEqual([
      { name: 'Name', value: 'name' },
    ]);
  });

  function invoke(component: Record<string, unknown>, method: string, ...args: unknown[]): void {
    (component[method] as (...parameters: unknown[]) => void)(...args);
  }
});
