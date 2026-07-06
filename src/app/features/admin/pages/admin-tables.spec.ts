/**
 * Pruebas unitarias parametrizadas de carga, edición y eliminación en tablas administrativas.
 */
import { TableSocialNetworkComponent } from './social-network/table-social-network/table-social-network.component';
import { TableTechnologyComponent } from './technology/table-technology/table-technology.component';
import { TableInstitutionComponent } from './institution/table-institution/table-institution.component';
import { TableEducationComponent } from './education/table-education/table-education.component';
import { TableProjectComponent } from './project/table-project/table-project.component';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { TableSkillComponent } from './skill/table-skill/table-skill.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { EducationService } from '@features/admin/services/education.service';
import { ProjectService } from '@features/admin/services/project.service';
import { SkillService } from '@features/admin/services/skill.service';
import { AlertService } from '@core/services/alert.service';
import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { of } from 'rxjs';

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
      loadMethod: 'getInstitutionListByDeleted',
      deleteMethod: 'deleteInstitution',
      modalMethod: 'modalInstitution',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getInstitutionListByDeleted',
      serviceDeleteMethod: 'deleteInstitution',
      record: { id: 1, name: 'University', name_es: 'Universidad' },
    },
    {
      name: 'education',
      component: TableEducationComponent,
      serviceToken: EducationService,
      loadMethod: 'getEducationListByDeleted',
      deleteMethod: 'deleteEducation',
      modalMethod: 'modalEducation',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getEducationListByDeleted',
      serviceDeleteMethod: 'deleteEducation',
      record: { id: 2, position: 1, title: 'Degree' },
    },
    {
      name: 'skill',
      component: TableSkillComponent,
      serviceToken: SkillService,
      loadMethod: 'getSkillListByDeleted',
      deleteMethod: 'deleteSkill',
      modalMethod: 'modalSkill',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getSkillListByDeleted',
      serviceDeleteMethod: 'deleteSkill',
      record: { id: 3, name: 'Angular', position: 1 },
    },
    {
      name: 'technology',
      component: TableTechnologyComponent,
      serviceToken: TechnologyService,
      loadMethod: 'getTechnologyListByDeleted',
      deleteMethod: 'deleteTechnology',
      modalMethod: 'modalTechnology',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getTechnologyListByDeleted',
      serviceDeleteMethod: 'deleteTechnology',
      record: { id: 4, name: 'Angular', position: 1, projects: [] },
    },
    {
      name: 'project',
      component: TableProjectComponent,
      serviceToken: ProjectService,
      loadMethod: 'getProjectListByDeleted',
      deleteMethod: 'deleteProject',
      modalMethod: 'modalProject',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getProjectListByDeleted',
      serviceDeleteMethod: 'deleteProject',
      record: { id: 5, title: 'Portfolio', position: 1, technology: 2 },
    },
    {
      name: 'social network',
      component: TableSocialNetworkComponent,
      serviceToken: SocialNetworkService,
      loadMethod: 'getSocialNetworkListByDeleted',
      deleteMethod: 'deleteSocialNetwork',
      modalMethod: 'modalSocialNetwork',
      confirmMethod: 'confirmDelete',
      serviceLoadMethod: 'getSocialNetworkListByDeleted',
      serviceDeleteMethod: 'deleteSocialNetwork',
      record: { id: 6, name: 'GitHub', position: 1 },
    },
  ];

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each(cases)('loads, refreshes, confirms and deletes $name records', async (testCase) => {
    const load = vi.fn().mockReturnValue(
      of({
        status: true,
        alert: '',
        data: [testCase.record],
      }),
    );
    const remove = vi.fn().mockReturnValue(
      of({
        status: true,
        alert: 'Deleted',
        data: [],
      }),
    );
    const service = {
      [testCase.serviceLoadMethod]: load,
      [testCase.serviceDeleteMethod]: remove,
    };
    const parameter = {
      openDialog: vi.fn().mockReturnValue({ closed: of(true) }),
    };
    const alert = {
      success: vi.fn(),
      httpError: vi.fn(),
      confirmDelete: vi.fn((action: () => void) => action()),
    };
    const spinner = { show: vi.fn(), hide: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [testCase.component],
      providers: [
        { provide: testCase.serviceToken, useValue: service },
        { provide: ParameterService, useValue: parameter },
        { provide: AlertService, useValue: alert },
        { provide: NgxSpinnerService, useValue: spinner },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(testCase.component);
    const component = fixture.componentInstance as {
      readonly records: () => readonly unknown[];
      ngOnDestroy(): void;
    } & Record<string, unknown>;

    invoke(component, testCase.loadMethod);
    expect(component.records()).toEqual([testCase.record]);
    expect(spinner.show).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();

    invoke(component, testCase.modalMethod, testCase.record);
    expect(parameter.openDialog).toHaveBeenCalled();
    expect(load).toHaveBeenCalledTimes(2);

    invoke(component, testCase.confirmMethod, testCase.record);
    expect(alert.confirmDelete).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith((testCase.record as { readonly id: number }).id);
    expect(alert.success).toHaveBeenCalledWith('Deleted');
    expect(load).toHaveBeenCalledTimes(3);

    component.ngOnDestroy();
    expect(spinner.hide).toHaveBeenCalled();
  });

  // Caso: cuenta posiciones de proyectos por tecnología para el diálogo de proyecto.
  it('counts project positions per technology for the project dialog', async () => {
    const records = [
      { id: 1, technology: 2, position: 1 },
      { id: 2, technology: 2, position: 2 },
      { id: 3, technology: 3, position: 1 },
    ];
    await TestBed.configureTestingModule({
      imports: [TableProjectComponent],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            getProjectListByDeleted: vi.fn().mockReturnValue(
              of({
                status: true,
                alert: '',
                data: records,
              }),
            ),
          },
        },
        { provide: ParameterService, useValue: { openDialog: vi.fn() } },
        {
          provide: AlertService,
          useValue: { success: vi.fn(), httpError: vi.fn(), confirmDelete: vi.fn() },
        },
        { provide: NgxSpinnerService, useValue: { show: vi.fn(), hide: vi.fn() } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(TableProjectComponent).componentInstance;
    component.getProjectListByDeleted();
    expect(component.positionsInfo()).toEqual({ 2: 2, 3: 1 });
  });

  function invoke(component: Record<string, unknown>, method: string, ...args: unknown[]): void {
    (component[method] as (...parameters: unknown[]) => void)(...args);
  }
});
