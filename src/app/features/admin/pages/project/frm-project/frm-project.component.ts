import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
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
import { PROJECT_LINK_TYPE_OPTIONS } from '@core/config/project-link-meta';
import { ProjectLinksControlComponent } from './project-links-control.component';
import { ProjectImagesControlComponent } from './project-images-control.component';
import { ProjectTechnologiesControlComponent } from './project-technologies-control.component';
import { ProjectFormFactory } from './project-form.factory';
import { finalize } from 'rxjs';
import { ProjectPersistenceService } from './project-persistence.service';
import { toProjectPayload } from './project-form.mapper';
import { PROJECT_IMAGE_LIMITS } from './project-form.validators';
import { ADMIN_POSITION_BUFFER } from '@features/admin/config/admin-page-text';
import { Project, ProjectImage } from '@shared/interfaces/project';
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
  providers: [ProjectFormFactory, ProjectPersistenceService],
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
  private readonly formFactory = inject(ProjectFormFactory);

  readonly existingImages = signal<readonly ProjectImage[]>(
    sortProjectImages(this.data.project?.images ?? []),
  );
  readonly projectForm = this.formFactory.create(
    this.data.project,
    () => this.existingImages().length,
  );

  readonly technologyList = signal<readonly Technology[]>([]);
  readonly linkTypeOptions = PROJECT_LINK_TYPE_OPTIONS;
  readonly isSaving = signal(false);
  readonly isUpdate = Boolean(this.data.project);
  readonly title = this.isUpdate ? 'Update Project' : 'New Project';
  positionList: number[] = [];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  private initializeForm(): void {
    this.getTechnologyList();
    this.loadPositions();
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
          this.existingImages.set(sortProjectImages(result.data.images));
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
      this.formFactory.createTechnology({ id: 0, position: this.technologies.length + 1 }),
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
      this.formFactory.createLink({
        type: 'DEPLOY',
        url: '',
        position: this.links.length + 1,
      }),
    );
  }

  removeLink(linkGroup: AbstractControl): void {
    const index = this.links.controls.findIndex((control) => control === linkGroup);
    if (index >= 0) {
      this.links.removeAt(index);
    }
  }

  get controls(): typeof this.projectForm.controls {
    return this.projectForm.controls;
  }
}

function sortProjectImages(images: readonly ProjectImage[]): readonly ProjectImage[] {
  return [...images].sort((left, right) => left.position - right.position);
}
