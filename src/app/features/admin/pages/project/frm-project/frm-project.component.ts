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
import {
  Project,
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

const projectLinkTypes: readonly { readonly value: ProjectLinkType; readonly label: string }[] = [
  { value: 'DEPLOY', label: 'Deploy' },
  { value: 'GITHUB', label: 'GitHub' },
  { value: 'GITHUB_FRONTEND', label: 'GitHub Frontend' },
  { value: 'GITHUB_BACKEND', label: 'GitHub Backend' },
];

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
    position: this.fb.nonNullable.control(this.data.project?.position ?? 0, [
      Validators.required,
      Validators.min(1),
    ]),
    technologies: this.fb.array(
      (this.data.project?.technologies?.length
        ? this.data.project.technologies
        : [{ id: 0, position: 1 }]
      ).map((technology) => this.createTechnologyGroup(technology)),
    ),
    links: this.fb.array(
      (this.data.project?.links ?? []).map((link) => this.createLinkGroup(link)),
    ),
    image: this.fb.control<File | null>(null, [
      this.parameter.imageFileValidator,
      ...(this.data.project ? [] : [Validators.required]),
    ]),
  });

  readonly technologyList = signal<readonly Technology[]>([]);
  readonly linkTypeOptions = projectLinkTypes;
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
    this.getTechnologyList();
    this.loadPositions();

    if (this.data.project) {
      const project = this.data.project;
      this.update = true;
      this.urlImage = project.picture || '';
      this.title = 'Update Project';
    }
  }

  loadPositions(): void {
    const total = 5 + (this.data.positions ?? 0);
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

    if (this.projectForm.invalid || !this.validateCollections()) {
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
          this.uploadProjectImage(result.data);
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
            this.uploadProjectImage(result.data);
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

  uploadProjectImage(project: Project): void {
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
      position: value.position,
      technologies: value.technologies.map((technology) => ({
        ...(technology.relation_id ? { relation_id: technology.relation_id } : {}),
        id: technology.id,
        position: technology.position,
      })),
      links: value.links.map((link) => ({
        ...(link.id ? { id: link.id } : {}),
        type: link.type,
        url: link.url.trim(),
        position: link.position,
      })),
    };
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

  removeTechnology(index: number): void {
    this.technologies.removeAt(index);
  }

  addLink(): void {
    this.links.push(
      this.createLinkGroup({ type: 'DEPLOY', url: '', position: this.links.length + 1 }),
    );
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  private createTechnologyGroup(technology: Partial<ProjectTechnology>) {
    return this.fb.group({
      relation_id: this.fb.control<number | null>(technology.relation_id ?? null),
      id: this.fb.nonNullable.control(technology.id ?? 0, [Validators.required, Validators.min(1)]),
      position: this.fb.nonNullable.control(technology.position ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  private createLinkGroup(link: Partial<ProjectLink>) {
    return this.fb.group({
      id: this.fb.control<number | null>(link.id ?? null),
      type: this.fb.nonNullable.control<ProjectLinkType>(
        link.type ?? 'DEPLOY',
        Validators.required,
      ),
      url: this.fb.nonNullable.control(link.url ?? '', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/),
      ]),
      position: this.fb.nonNullable.control(link.position ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  private validateCollections(): boolean {
    const technologyValues = this.technologies.getRawValue();
    const technologyIds = technologyValues.map((technology) => technology.id);
    const technologyPositions = technologyValues.map((technology) => technology.position);
    const technologyError =
      technologyValues.length === 0 ||
      new Set(technologyIds).size !== technologyIds.length ||
      new Set(technologyPositions).size !== technologyPositions.length;
    this.technologies.setErrors(technologyError ? { duplicateOrEmpty: true } : null);

    const linkValues = this.links.getRawValue();
    const linkTypes = linkValues.map((link) => link.type);
    const linkPositions = linkValues.map((link) => link.position);
    const linkError =
      new Set(linkTypes).size !== linkTypes.length ||
      new Set(linkPositions).size !== linkPositions.length;
    this.links.setErrors(linkError ? { duplicate: true } : null);

    return !technologyError && !linkError;
  }

  get controls(): typeof this.projectForm.controls {
    return this.projectForm.controls;
  }
}
