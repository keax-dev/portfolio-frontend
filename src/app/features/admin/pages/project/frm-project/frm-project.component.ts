import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '@features/admin/services/project.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Technology } from '@shared/interfaces/technology';
import { finalize } from 'rxjs';
import { Project } from '@shared/interfaces/project';
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
  readonly positionsInfo?: Readonly<Record<number, number>>;
}

@Component({
  selector: 'app-frm-project',
  templateUrl: './frm-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UppercaseDirective,
    MatFormFieldModule,
    MatSelectModule,
    ButtonComponent,
    MatInputModule,
  ],
})
export class FrmProjectComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly technologyService = inject(TechnologyService);
  private readonly projectService = inject(ProjectService);
  private readonly imageService = inject(ImageService);
  private readonly parameter = inject(ParameterService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<ProjectDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Project>>(MatDialogRef);
  private readonly fb = inject(FormBuilder);

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
    deploy: this.fb.nonNullable.control(this.data.project?.deploy ?? ''),
    github: this.fb.nonNullable.control(this.data.project?.github ?? ''),
    position: this.fb.nonNullable.control(this.data.project?.position ?? 0, [
      Validators.required,
      Validators.min(1),
    ]),
    technology: this.fb.nonNullable.control(this.data.project?.technology ?? 0, [
      Validators.required,
      Validators.min(1),
    ]),
    image: this.fb.control<File | null>(null, [
      this.parameter.imageFileValidator,
      ...(this.data.project ? [] : [Validators.required]),
    ]),
  });

  readonly technologyList = signal<readonly Technology[]>([]);
  readonly isSaving = signal(false);
  positionList: number[] = [];
  urlImage = '';
  title = 'New Project';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.getTechnologyListByDeleted();

    if (this.data.project) {
      const project = this.data.project;
      this.update = true;
      this.urlImage = project.picture || '';
      this.title = 'Update Project';
      this.loadPositionByTechnology(project.technology);
    }
  }

  loadPositionByTechnology(technologyId: number): void {
    const total = 5 + (this.data.positionsInfo?.[technologyId] ?? 0);
    this.positionList = Array.from({ length: total }, (_, i) => i + 1);
  }

  getTechnologyListByDeleted(): void {
    this.spinner.show();
    this.technologyService
      .getTechnologyListByDeleted()
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

    if (this.update) {
      this.updateProject();
      return;
    }

    this.createProject();
  }

  createProject(): void {
    this.isSaving.set(true);
    this.projectService
      .createProject(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.alert.httpError(error);
        },
      });
  }

  updateProject(): void {
    this.isSaving.set(true);
    this.projectService
      .updateProject(this.data.project!.id!, this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageInstitution(result.data);
            return;
          }

          this.close(result.data);
          this.isSaving.set(false);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.alert.httpError(error);
        },
      });
  }

  uploadImageInstitution(project: Project): void {
    const image = this.controls.image.value;
    if (!image) {
      this.isSaving.set(false);
      return;
    }

    this.imageService
      .uploadImageProject(project.id!, image)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => {
          this.close(project);
          this.alert.httpError(error);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.controls.image.setValue(input.files[0]);
    }
  }

  close(project?: Project): void {
    this.ref.close(project);
  }

  get project() {
    const value = this.projectForm.getRawValue();
    return {
      title: value.title,
      title_es: value.title_es,
      description: value.description,
      description_es: value.description_es,
      deploy: value.deploy,
      github: value.github,
      position: value.position,
      technology: value.technology,
    };
  }

  get controls(): typeof this.projectForm.controls {
    return this.projectForm.controls;
  }
}
