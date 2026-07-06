/**
 * Pruebas unitarias de formularios administrativos que encadenan guardado y carga de imágenes.
 */
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FrmInstitutionComponent } from './institution/frm-institution/frm-institution.component';
import { FrmProfileComponent } from './profile/frm-profile/frm-profile.component';
import { FrmProjectComponent } from './project/frm-project/frm-project.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TechnologyService } from '@features/admin/services/technology.service';
import { FrmSkillComponent } from './skill/frm-skill/frm-skill.component';
import { ParameterService } from '@core/services/parameter.service';
import { of, throwError } from 'rxjs';
import { ProfileService } from '@features/admin/services/profile.service';
import { ProjectService } from '@features/admin/services/project.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { SkillService } from '@features/admin/services/skill.service';
import { Institution } from '@shared/interfaces/institution';
import { TestBed } from '@angular/core/testing';
import { Profile } from '@shared/interfaces/profile';
import { Project } from '@shared/interfaces/project';
import { Skill } from '@shared/interfaces/skill';

describe('image admin forms', () => {
  const spinner = () => ({ show: vi.fn(), hide: vi.fn() });
  const alert = () => ({ success: vi.fn(), httpError: vi.fn() });
  const dialogRef = () => ({ close: vi.fn() });
  const parameter = () => ({ imageFileValidator: vi.fn().mockReturnValue(null) });
  const response = <T>(data: T, text = 'Saved') => ({
    status: true,
    alert: text,
    data,
  });

  // Caso: requiere una imagen al crear una institución y la sube después de crearla.
  it('requires an image when creating an institution and uploads it after creation', async () => {
    const created: Institution = { id: 1, name: 'ESPOL', name_es: 'ESPOL' };
    const withImage: Institution = { ...created, url: 'institution.png' };
    const institutionService = {
      createInstitution: vi.fn().mockReturnValue(of(response(created))),
      updateInstitution: vi.fn(),
    };
    const imageService = {
      uploadImageInstitution: vi.fn().mockReturnValue(of(response(withImage, 'Uploaded'))),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmInstitutionComponent],
      providers: [
        { provide: InstitutionService, useValue: institutionService },
        { provide: ImageService, useValue: imageService },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: DialogRef, useValue: ref },
        { provide: DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmInstitutionComponent).componentInstance;
    component.institutionForm.patchValue({ name: 'ESPOL', name_es: 'ESPOL' });
    component.onSubmit();
    expect(institutionService.createInstitution).not.toHaveBeenCalled();

    const file = new File(['image'], 'institution.png', { type: 'image/png' });
    component.controls.image.setValue(file);
    component.onSubmit();

    expect(institutionService.createInstitution).toHaveBeenCalledWith({
      name: 'ESPOL',
      name_es: 'ESPOL',
    });
    expect(imageService.uploadImageInstitution).toHaveBeenCalledWith(1, file);
    expect(ref.close).toHaveBeenCalledWith(withImage);
  });

  // Caso: actualiza una institución sin requerir una imagen de reemplazo.
  it('updates an institution without requiring a replacement image', async () => {
    const existing: Institution = {
      id: 2,
      name: 'University',
      name_es: 'Universidad',
      url: 'old.png',
    };
    const service = {
      createInstitution: vi.fn(),
      updateInstitution: vi.fn().mockReturnValue(of(response(existing))),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmInstitutionComponent],
      providers: [
        { provide: InstitutionService, useValue: service },
        { provide: ImageService, useValue: {} },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: DialogRef, useValue: ref },
        { provide: DIALOG_DATA, useValue: existing },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmInstitutionComponent).componentInstance;
    component.ngOnInit();
    component.onSubmit();

    expect(component.update).toBe(true);
    expect(component.urlImage).toBe('old.png');
    expect(service.updateInstitution).toHaveBeenCalledWith(2, {
      name: 'University',
      name_es: 'Universidad',
    });
    expect(ref.close).toHaveBeenCalledWith(existing);
  });

  // Caso: crea una habilidad y sube su imagen.
  it('creates a skill and uploads its image', async () => {
    const created: Skill = { id: 3, name: 'Angular', position: 1 };
    const withImage: Skill = { ...created, picture: 'angular.png' };
    const skillService = {
      createSkill: vi.fn().mockReturnValue(of(response(created))),
      updateSkill: vi.fn(),
    };
    const imageService = {
      uploadImageSkill: vi.fn().mockReturnValue(of(response(withImage))),
    };
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmSkillComponent],
      providers: [
        { provide: SkillService, useValue: skillService },
        { provide: ImageService, useValue: imageService },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: DialogRef, useValue: ref },
        { provide: DIALOG_DATA, useValue: { positions: 3 } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmSkillComponent).componentInstance;
    const file = new File(['image'], 'angular.png', { type: 'image/png' });
    component.skillForm.setValue({ name: 'Angular', position: 1, image: file });

    component.onSubmit();

    expect(skillService.createSkill).toHaveBeenCalledWith({ name: 'Angular', position: 1 });
    expect(imageService.uploadImageSkill).toHaveBeenCalledWith(3, file);
    expect(ref.close).toHaveBeenCalledWith(withImage);
  });

  // Caso: cierra con la habilidad guardada cuando falla la subida de su imagen.
  it('closes with the saved skill when its image upload fails', async () => {
    const saved: Skill = { id: 3, name: 'Angular', position: 1 };
    const failure = new Error('upload failed');
    const messages = alert();
    const ref = dialogRef();

    await TestBed.configureTestingModule({
      imports: [FrmSkillComponent],
      providers: [
        { provide: SkillService, useValue: {} },
        {
          provide: ImageService,
          useValue: { uploadImageSkill: vi.fn().mockReturnValue(throwError(() => failure)) },
        },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: messages },
        { provide: DialogRef, useValue: ref },
        { provide: DIALOG_DATA, useValue: { positions: 2 } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmSkillComponent).componentInstance;
    component.controls.image.setValue(new File(['x'], 'x.png', { type: 'image/png' }));
    component.uploadImageInstitution(saved);

    expect(ref.close).toHaveBeenCalledWith(saved);
    expect(messages.httpError).toHaveBeenCalledWith(failure);
  });

  // Caso: crea un proyecto, quita la imagen del payload y luego la sube.
  it('creates a project, strips the image from its payload and then uploads it', async () => {
    const created = project(4);
    const withImage = { ...created, picture: 'project.png' };
    const projectService = {
      createProject: vi.fn().mockReturnValue(of(response(created))),
      updateProject: vi.fn(),
    };
    const imageService = {
      uploadImageProject: vi.fn().mockReturnValue(of(response(withImage))),
    };
    const technologyService = {
      getTechnologyListByDeleted: vi
        .fn()
        .mockReturnValue(of(response([{ id: 2, name: 'Angular', position: 1, projects: [] }]))),
    };
    const ref = dialogRef();
    const file = new File(['image'], 'project.png', { type: 'image/png' });

    await TestBed.configureTestingModule({
      imports: [FrmProjectComponent],
      providers: [
        { provide: ProjectService, useValue: projectService },
        { provide: ImageService, useValue: imageService },
        { provide: TechnologyService, useValue: technologyService },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
        { provide: DialogRef, useValue: ref },
        { provide: DIALOG_DATA, useValue: { positionsInfo: { 2: 3 } } },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmProjectComponent).componentInstance;
    component.projectForm.setValue({
      title: 'Portfolio',
      title_es: 'Portafolio',
      description: 'Description',
      description_es: 'Descripción',
      deploy: '',
      github: '',
      position: 1,
      technology: 2,
      image: file,
    });
    component.loadPositionByTechnology(2);
    component.onSubmit();

    expect(component.positionList).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(projectService.createProject).toHaveBeenCalledWith({
      title: 'Portfolio',
      title_es: 'Portafolio',
      description: 'Description',
      description_es: 'Descripción',
      deploy: '',
      github: '',
      position: 1,
      technology: 2,
    });
    expect(imageService.uploadImageProject).toHaveBeenCalledWith(4, file);
    expect(ref.close).toHaveBeenCalledWith(withImage);
  });

  // Caso: crea un perfil con imagen y pasa al modo de actualización.
  it('creates a profile with an image and transitions to update mode', async () => {
    const created: Profile = {
      name: 'Kevin',
      last_name: 'Galarza',
      title: 'Engineer',
      title_es: 'Ingeniero',
      cv: 'https://example.com/cv.pdf',
    };
    const withImage = { ...created, image: 'profile.png' };
    const profileService = {
      getProfile: vi.fn(),
      createProfile: vi.fn().mockReturnValue(of(response(created))),
      updateProfile: vi.fn(),
    };
    const imageService = {
      uploadImageProfile: vi.fn().mockReturnValue(of(response(withImage))),
    };
    const file = new File(['image'], 'profile.png', { type: 'image/png' });

    await TestBed.configureTestingModule({
      imports: [FrmProfileComponent],
      providers: [
        { provide: ProfileService, useValue: profileService },
        { provide: ImageService, useValue: imageService },
        { provide: ParameterService, useValue: parameter() },
        { provide: NgxSpinnerService, useValue: spinner() },
        { provide: AlertService, useValue: alert() },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(FrmProfileComponent).componentInstance;
    component.profileForm.setValue({ ...created, image: file });
    component.onSubmit();

    expect(profileService.createProfile).toHaveBeenCalledWith(created);
    expect(imageService.uploadImageProfile).toHaveBeenCalledWith(file);
    expect(component.previousProfile()).toEqual(withImage);
    expect(component.urlPicture()).toBe('profile.png');
    expect(component.update()).toBe(true);
  });

  function project(id: number): Project {
    return {
      id,
      title: 'Portfolio',
      title_es: 'Portafolio',
      description: 'Description',
      description_es: 'Descripción',
      deploy: '',
      github: '',
      position: 1,
      technology: 2,
    };
  }
});
