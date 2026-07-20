import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Technology } from '@shared/interfaces/technology';
import { PROJECT_LINK_TYPE_OPTIONS } from '@shared/config/project-link-meta';
import { httpsUrlValidator } from '@core/validators/external-url.validator';
import { ProjectLinksControlComponent } from './project-links-control.component';
import { ProjectImagesControlComponent } from './project-images-control.component';
import { ProjectTechnologiesControlComponent } from './project-technologies-control.component';
import { ProjectLinkFormGroup, ProjectTechnologyFormGroup } from './project-form.types';
import { finalize } from 'rxjs';
import { ProjectPersistenceService } from './project-persistence.service';
import { toProjectPayload } from './project-form.mapper';
import {
  PROJECT_IMAGE_LIMITS,
  projectImageFilesValidator,
  projectLinksValidator,
  projectTechnologiesValidator,
} from './project-form.validators';
import { ADMIN_POSITION_BUFFER } from '@features/admin/config/admin-page-text';
import {
  Project,
  ProjectImage,
  ProjectLink,
  ProjectLinkType,
  ProjectTechnology,
} from '@shared/interfaces/project';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

interface ProjectDialogData {
  readonly project?: Project;
  readonly positions?: number;
}

@Component({
  selector: 'app-frm-project',
  templateUrl: './frm-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectPersistenceService],
  imports: [
    ReactiveFormsModule,
    UppercaseDirective,
    MatFormFieldModule,
    MatSelectModule,
    ButtonComponent,
    MatInputModule,
    ProjectTechnologiesControlComponent,
    ProjectLinksControlComponent,
    ProjectImagesControlComponent,
  ],
})
export class FrmProjectComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly technologyService = inject(TechnologyService);
  private readonly persistence = inject(ProjectPersistenceService);
  private readonly imageService = inject(ImageService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<ProjectDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Project>>(MatDialogRef);
  private readonly fb = inject(FormBuilder);

  readonly existingImages = signal<readonly ProjectImage[]>(this.initialProjectImages());

  readonly projectForm = this.fb.group({
    title: this.fb.nonNullable.control(this.data.project?.title ?? '', Validators.required),
    title_es: this.fb.nonNullable.control(this.data.project?.title_es ?? '', Validators.required),
    description: this.fb.nonNullable.control(
      this.data.project?.description ?? '',
      Validators.required,
    ),
    description_es: this.fb.nonNullable.control(
      this.data.project?.description_es ?? '',
      Validators.required,
    ),
    position: this.fb.nonNullable.control(this.data.project?.position ?? 0, [
      Validators.required,
      Validators.min(1),
    ]),
    technologies: this.fb.array(
      (this.data.project?.technologies?.length
        ? this.data.project.technologies
        : [{ id: 0, position: 1 }]
      ).map((technology) => this.createTechnologyGroup(technology)),
      { validators: [projectTechnologiesValidator()] },
    ),
    links: this.fb.array(
      (this.data.project?.links ?? []).map((link) => this.createLinkGroup(link)),
      { validators: [projectLinksValidator()] },
    ),
    images: this.fb.nonNullable.control<File[]>(
      [],
      [projectImageFilesValidator(() => this.existingImages().length)],
    ),
  });

  readonly technologyList = signal<readonly Technology[]>([]);
  readonly linkTypeOptions = PROJECT_LINK_TYPE_OPTIONS;
  readonly isSaving = signal(false);
  positionList: number[] = [];
  title = 'New Project';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.getTechnologyList();
    this.loadPositions();

    if (this.data.project) {
      this.update = true;
      this.title = 'Update Project';
    }
  }

  loadPositions(): void {
    const total = ADMIN_POSITION_BUFFER + (this.data.positions ?? 0);
    this.positionList = Array.from({ length: total }, (_, i) => i + 1);
  }

  getTechnologyList(): void {
    this.spinner.show();
    this.technologyService
      .getTechnologyList()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => this.technologyList.set(result.data),
        error: (error) => this.alert.httpError(error),
      });
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.persistence
      .save(this.data.project?.id ?? null, this.project, this.controls.images.value)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const images = input.files ? Array.from(input.files) : [];
    this.controls.images.setValue(images);
    this.controls.images.markAsTouched();
    this.controls.images.updateValueAndValidity();
  }

  removeExistingImage(image: ProjectImage): void {
    if (!this.data.project || this.existingImages().length <= PROJECT_IMAGE_LIMITS.min) {
      return;
    }

    this.isSaving.set(true);
    this.imageService
      .deleteProjectImage(this.data.project.id, image.id)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.existingImages.set(this.normalizeImages(result.data));
          this.controls.images.updateValueAndValidity();
          this.alert.success(result.alert);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  close(project?: Project): void {
    this.ref.close(project);
  }

  get project() {
    return toProjectPayload(this.projectForm.getRawValue());
  }

  get technologies() {
    return this.controls.technologies;
  }

  get links() {
    return this.controls.links;
  }

  addTechnology(): void {
    this.technologies.push(
      this.createTechnologyGroup({ id: 0, position: this.technologies.length + 1 }),
    );
  }

  removeTechnology(technologyGroup: AbstractControl): void {
    const index = this.technologies.controls.findIndex((control) => control === technologyGroup);
    if (index >= 0) {
      this.technologies.removeAt(index);
    }
  }

  addLink(): void {
    this.links.push(
      this.createLinkGroup({ type: 'DEPLOY', url: '', position: this.links.length + 1 }),
    );
  }

  removeLink(linkGroup: AbstractControl): void {
    const index = this.links.controls.findIndex((control) => control === linkGroup);
    if (index >= 0) {
      this.links.removeAt(index);
    }
  }

  private createTechnologyGroup(
    technology: Partial<ProjectTechnology>,
  ): ProjectTechnologyFormGroup {
    return this.fb.group({
      relation_id: this.fb.control<number | null>(technology.relation_id ?? null),
      id: this.fb.nonNullable.control(technology.id ?? 0, [Validators.required, Validators.min(1)]),
      position: this.fb.nonNullable.control(technology.position ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  private createLinkGroup(link: Partial<ProjectLink>): ProjectLinkFormGroup {
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

  private initialProjectImages(): ProjectImage[] {
    return this.normalizeImages(this.data.project);
  }

  private normalizeImages(project?: Project): ProjectImage[] {
    const images = project?.images ?? [];
    return [...images].sort((a, b) => a.position - b.position);
  }

  get controls(): typeof this.projectForm.controls {
    return this.projectForm.controls;
  }
}
