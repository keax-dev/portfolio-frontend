import { TestBed } from '@angular/core/testing';
import { ImageService } from '@features/admin/services/images.service';
import { ProjectPersistenceService } from '@features/admin/pages/project/frm-project/project-persistence.service';
import { ProjectService } from '@features/admin/services/project.service';
import { Project, ProjectPayload } from '@shared/interfaces/project';
import { firstValueFrom, of, throwError } from 'rxjs';

describe('ProjectPersistenceService', () => {
  let projects: {
    createProject: ReturnType<typeof vi.fn>;
    updateProject: ReturnType<typeof vi.fn>;
    deleteProject: ReturnType<typeof vi.fn>;
  };
  let images: { uploadProjectImages: ReturnType<typeof vi.fn> };
  let persistence: ProjectPersistenceService;

  const payload: ProjectPayload = {
    title: 'Portfolio',
    title_es: 'Portafolio',
    description: 'Description',
    description_es: 'Descripción',
    position: 1,
    technologies: [{ id: 1, position: 1 }],
    links: [],
  };
  const project: Project = {
    id: 4,
    ...payload,
    images: [],
    technologies: [{ relation_id: 1, id: 1, name: 'Angular', position: 1 }],
    links: [],
  };
  const response = { status: true, alert: 'Saved', data: project };

  beforeEach(() => {
    projects = {
      createProject: vi.fn().mockReturnValue(of(response)),
      updateProject: vi.fn().mockReturnValue(of(response)),
      deleteProject: vi.fn().mockReturnValue(of({ status: true, alert: 'Deleted', data: [] })),
    };
    images = { uploadProjectImages: vi.fn().mockReturnValue(of(response)) };
    TestBed.configureTestingModule({
      providers: [
        ProjectPersistenceService,
        { provide: ProjectService, useValue: projects },
        { provide: ImageService, useValue: images },
      ],
    });
    persistence = TestBed.inject(ProjectPersistenceService);
  });

  it('creates the project and uploads its images in sequence', async () => {
    const file = new File(['image'], 'project.png', { type: 'image/png' });
    await expect(firstValueFrom(persistence.save(null, payload, [file]))).resolves.toBe(response);
    expect(projects.createProject).toHaveBeenCalledWith(payload);
    expect(images.uploadProjectImages).toHaveBeenCalledWith(4, [file]);
  });

  it('rolls back a newly created project when image upload fails', async () => {
    const failure = new Error('upload failed');
    images.uploadProjectImages.mockReturnValue(throwError(() => failure));

    await expect(
      firstValueFrom(
        persistence.save(null, payload, [
          new File(['image'], 'project.png', { type: 'image/png' }),
        ]),
      ),
    ).rejects.toBe(failure);
    expect(projects.deleteProject).toHaveBeenCalledWith(4);
  });

  it('updates without invoking image upload when no files were selected', async () => {
    await expect(firstValueFrom(persistence.save(4, payload, []))).resolves.toBe(response);
    expect(projects.updateProject).toHaveBeenCalledWith(4, payload);
    expect(images.uploadProjectImages).not.toHaveBeenCalled();
  });

  it('does not delete an existing project when replacement image upload fails', async () => {
    const failure = new Error('upload failed');
    images.uploadProjectImages.mockReturnValue(throwError(() => failure));
    await expect(
      firstValueFrom(
        persistence.save(4, payload, [new File(['image'], 'project.png', { type: 'image/png' })]),
      ),
    ).rejects.toBe(failure);
    expect(projects.deleteProject).not.toHaveBeenCalled();
  });
});
