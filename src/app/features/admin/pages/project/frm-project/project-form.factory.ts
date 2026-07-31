import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { httpsUrlValidator } from '@core/validators/external-url.validator';
import {
  Project,
  ProjectLink,
  ProjectLinkType,
  ProjectTechnology,
} from '@shared/interfaces/project';
import {
  ProjectFormGroup,
  ProjectLinkFormGroup,
  ProjectTechnologyFormGroup,
} from './project-form.types';
import {
  projectImageFilesValidator,
  projectLinksValidator,
  projectTechnologiesValidator,
} from './project-form.validators';

@Injectable()
export class ProjectFormFactory {
  private readonly fb = inject(FormBuilder);

  create(project: Project | undefined, existingImageCount: () => number): ProjectFormGroup {
    return this.fb.group({
      title: this.fb.nonNullable.control(project?.title ?? '', Validators.required),
      title_es: this.fb.nonNullable.control(project?.title_es ?? '', Validators.required),
      description: this.fb.nonNullable.control(project?.description ?? '', Validators.required),
      description_es: this.fb.nonNullable.control(
        project?.description_es ?? '',
        Validators.required,
      ),
      position: this.fb.nonNullable.control(project?.position ?? 0, [
        Validators.required,
        Validators.min(1),
      ]),
      technologies: this.fb.array(
        (project?.technologies.length ? project.technologies : [{ id: 0, position: 1 }]).map(
          (technology) => this.createTechnology(technology),
        ),
        { validators: [projectTechnologiesValidator()] },
      ),
      links: this.fb.array(
        (project?.links ?? []).map((link) => this.createLink(link)),
        { validators: [projectLinksValidator()] },
      ),
      images: this.fb.nonNullable.control<File[]>(
        [],
        [projectImageFilesValidator(existingImageCount)],
      ),
    });
  }

  createTechnology(technology: Partial<ProjectTechnology>): ProjectTechnologyFormGroup {
    return this.fb.group({
      relation_id: this.fb.control<number | null>(technology.relation_id ?? null),
      id: this.fb.nonNullable.control(technology.id ?? 0, [Validators.required, Validators.min(1)]),
      position: this.fb.nonNullable.control(technology.position ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  createLink(link: Partial<ProjectLink>): ProjectLinkFormGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(link.id ?? null),
      type: this.fb.nonNullable.control<ProjectLinkType>(
        link.type ?? 'DEPLOY',
        Validators.required,
      ),
      url: this.fb.nonNullable.control(link.url ?? '', [Validators.required, httpsUrlValidator()]),
      position: this.fb.nonNullable.control(link.position ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }
}
