/**
 * Pruebas unitarias de creación, actualización y validación en formularios administrativos simples.
 */
import { FrmSocialNetworkComponent } from '@features/admin/pages/social-network/frm-social-network/frm-social-network.component';
import { FrmEducationComponent } from '@features/admin/pages/education/frm-education/frm-education.component';
import { FrmTechnologyComponent } from '@features/admin/pages/technology/frm-technology/frm-technology.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialNetworkService } from '@features/admin/services/social-network.service';
import { InstitutionService } from '@features/admin/services/institution.service';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EducationService } from '@features/admin/services/education.service';
import { of, throwError } from 'rxjs';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/interfaces/education';
import { Technology } from '@shared/interfaces/technology';
import { TestBed } from '@angular/core/testing';

describe('simple admin forms', () => {
  const spinner = () => ({ show: vi.fn(), hide: vi.fn() });
  const alert = () => ({ success: vi.fn(), httpError: vi.fn() });
  const dialogRef = () => ({ close: vi.fn() });
  const response = <T>(data: T) => ({ status: true, alert: 'Saved', data });

  // Caso: crea una tecnología desde un formulario válido.
  it('creates a technology from a valid form', async () => {
    const service = {
      createTechnology: vi.fn(),
      updateTechnology: vi.fn(),
    };
    const saved: Technology = { id: 1, name: 'Angular' };
    service.createTechnology.mockReturnValue(of(response(saved)));
    const ref = dialogRef();
    const loading = spinner();
    const messages = alert();

    await TestBed.configureTestingModule({
      imports: [FrmTechnologyComponent],
      providers: [
        { provide: TechnologyService, useValue: service },
        { provide: NgxSpinnerService, useValue: loading },
        { provide: AlertService, useValue: messages },
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmTechnologyComponent).componentInstance;
    component.technologyForm.setValue({ name: 'Angular' });

    component.onSubmit();

    expect(service.createTechnology).toHaveBeenCalledWith({ name: 'Angular' });
    expect(messages.success).toHaveBeenCalledWith('Saved');
    expect(ref.close).toHaveBeenCalledWith(saved);
    expect(component.isSaving()).toBe(false);
  });

  // Caso: carga y actualiza una tecnología existente.
  it('loads and updates an existing technology', async () => {
    const existing: Technology = {
      id: 3,
      name: 'Angular',
    };
    const service = {
      createTechnology: vi.fn(),
      updateTechnology: vi.fn().mockReturnValue(of(response(existing))),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmTechnologyComponent],
      providers: [
        { provide: TechnologyService, useValue: service },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: { technology: existing } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmTechnologyComponent).componentInstance;
    component.ngOnInit();
    component.onSubmit();

    expect(component.update).toBe(true);
    expect(component.title).toBe('Update Technology');
    expect(service.updateTechnology).toHaveBeenCalledWith(3, { name: 'Angular' });
    expect(ref.close).toHaveBeenCalledWith(existing);
  });

  // Caso: valida la URL de la red social y crea un registro válido.
  it('validates the social-network URL and creates a valid network', async () => {
    const saved: SocialNetwork = {
      id: 1,
      name: 'GitHub',
      icon: 'github',
      color: '#000',
      url: 'https://github.com/example',
      position: 1,
    };
    const service = {
      createSocialNetwork: vi.fn().mockReturnValue(of(response(saved))),
      updateSocialNetwork: vi.fn(),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmSocialNetworkComponent],
      providers: [
        { provide: SocialNetworkService, useValue: service },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: { positions: 2 } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmSocialNetworkComponent).componentInstance;
    component.socialNetworkForm.setValue({
      name: 'GitHub',
      icon: 'github',
      color: '#000',
      url: 'javascript:alert(1)',
      position: 1,
    });
    component.onSubmit();
    expect(service.createSocialNetwork).not.toHaveBeenCalled();

    component.controls.url.setValue('https://github.com/example');
    component.onSubmit();
    expect(service.createSocialNetwork).toHaveBeenCalled();
    expect(ref.close).toHaveBeenCalledWith(saved);
  });

  // Caso: actualiza una red social existente.
  it('updates an existing social network', async () => {
    const existing: SocialNetwork = {
      id: 5,
      name: 'LinkedIn',
      icon: 'linkedin',
      color: '#00f',
      url: 'https://linkedin.com',
      position: 2,
    };
    const service = {
      createSocialNetwork: vi.fn(),
      updateSocialNetwork: vi.fn().mockReturnValue(of(response(existing))),
    };

    await TestBed.configureTestingModule({
      imports: [FrmSocialNetworkComponent],
      providers: [
        { provide: SocialNetworkService, useValue: service },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: MatDialogRef, useValue: dialogRef() },
        { provide: MAT_DIALOG_DATA, useValue: { positions: 3, socialNetwork: existing } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmSocialNetworkComponent).componentInstance;
    component.ngOnInit();
    component.onSubmit();

    expect(service.updateSocialNetwork).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ name: 'LinkedIn' }),
    );
  });

  // Caso: carga instituciones y crea un registro de educación.
  it('loads institutions and creates an education record', async () => {
    const saved = education(1);
    const educationService = {
      createEducation: vi.fn().mockReturnValue(of(response(saved))),
      updateEducation: vi.fn(),
    };
    const institutionService = {
      getInstitutionList: vi
        .fn()
        .mockReturnValue(of(response([{ id: 2, name: 'University', name_es: 'Universidad' }]))),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmEducationComponent],
      providers: [
        { provide: EducationService, useValue: educationService },
        { provide: InstitutionService, useValue: institutionService },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: { positions: 3 } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmEducationComponent).componentInstance;
    component.ngOnInit();
    component.educationForm.setValue({
      title: 'Degree',
      title_es: 'Título',
      institution: 2,
      place: 'Guayaquil',
      start: '2020',
      start_es: '2020',
      end: '2024',
      end_es: '2024',
      position: 1,
    });
    component.onSubmit();

    expect(component.institutionList()).toHaveLength(1);
    expect(educationService.createEducation).toHaveBeenCalled();
    expect(ref.close).toHaveBeenCalledWith(saved);
  });

  // Caso: reporta errores al cargar instituciones en el formulario de educación.
  it('reports institution loading errors in the education form', async () => {
    const failure = new Error('offline');
    const messages = alert();

    await TestBed.configureTestingModule({
      imports: [FrmEducationComponent],
      providers: [
        { provide: EducationService, useValue: {} },
        {
          provide: InstitutionService,
          useValue: {
            getInstitutionList: vi.fn().mockReturnValue(throwError(() => failure)),
          },
        },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: messages },
        { provide: MatDialogRef, useValue: dialogRef() },
        { provide: MAT_DIALOG_DATA, useValue: { positions: 1 } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmEducationComponent).componentInstance;
    component.getInstitutionList();
    expect(messages.httpError).toHaveBeenCalledWith(failure);
  });

  function education(position: number): Education {
    return {
      id: 1,
      title: 'Degree',
      title_es: 'Título',
      institution: 2,
      place: 'Guayaquil',
      place_es: '',
      start: '2020',
      start_es: '2020',
      end: '2024',
      end_es: '2024',
      position,
      deleted: false,
      institution_name: 'University',
      institution_name_es: 'Universidad',
      institution_url: '',
    };
  }
});
