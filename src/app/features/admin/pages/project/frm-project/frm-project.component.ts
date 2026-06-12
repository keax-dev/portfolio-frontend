import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ProjectService } from '@features/admin/services/project.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Technology } from '@shared/models/technology';
import { Project } from '@shared/models/project';
import { UppercaseDirective } from '../../../../../shared/components/directive/uppercase.directive';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-frm-project',
    templateUrl: './frm-project.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, Select, ButtonComponent]
})
export class FrmProjectComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private technologyService = inject(TechnologyService);
  private projectService = inject(ProjectService);
  private imageService = inject(ImageService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  projectForm!: FormGroup;

  technologyList: Technology[] = [];
  positionList: number[] = [];
  urlImage!: string;
  title = 'New Project';

  update!: boolean;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.getTechnologyListByDeleted();

    if (this.config.data.project) {
      const project: Project = this.config.data.project;
      this.update = true;
      this.urlImage = project.picture || '';
      this.title = 'Update Project';
      this.loadPositionByTechnology(project.technology);
      this.buildForm(
        project.title,
        project.title_es,
        project.description,
        project.description_es,
        project.deploy,
        project.github,
        project.position,
        project.technology
      );
      return;
    }

    this.buildForm();
  }

  buildForm(
    title = '',
    titleEs = '',
    description = '',
    descriptionEs = '',
    deploy = '',
    github = '',
    position: number | null = null,
    technology: number | null = null
  ): void {
    const validatorsImg = [this.parameter.imageFileValidator];

    if (!title) validatorsImg.push(Validators.required);

    this.projectForm = this.fb.group({
      title: [title, [Validators.required]],
      title_es: [titleEs, [Validators.required]],
      description: [description, [Validators.required]],
      description_es: [descriptionEs, [Validators.required]],
      deploy: [deploy],
      github: [github],
      position: [position, [Validators.required]],
      technology: [technology, [Validators.required]],
      image: [null, validatorsImg]
    });
  }

  loadPositionByTechnology(technologyId: number): void {
    const total = 5 + (this.config.data.positionsInfo?.[technologyId] ?? 0);
    this.positionList = Array.from({ length: total }, (_, i) => i + 1);
  }

  getTechnologyListByDeleted(): void {
    this.spinner.show();
    this.technologyService.getTechnologyListByDeleted().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => this.technologyList = result.data,
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  onSubmit(): void {
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
    this.spinner.show();
    this.projectService.createProject(this.project).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.uploadImageInstitution(result.data);
      },
      error: error => this.alert.httpError(error)
    });
  }

  updateProject(): void {
    this.spinner.show();
    this.projectService.updateProject(this.config.data.project.id, this.project).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        if (this.controls['image'].value) {
          this.uploadImageInstitution(result.data);
          return;
        }

        this.close(result.data);
        this.spinner.hide();
      },
      error: error => this.alert.httpError(error)
    });
  }

  uploadImageInstitution(project: Project): void {
    this.imageService.uploadImageProject(project.id!, this.controls['image'].value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => {
        this.close(project);
        this.alert.httpError(error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.projectForm.get('image')?.setValue(input.files[0]);
    }
  }

  close(project?: Project): void {
    this.ref.close(project);
  }

  get project() {
    return {
      title: this.controls['title'].value,
      title_es: this.controls['title_es'].value,
      description: this.controls['description'].value,
      description_es: this.controls['description_es'].value,
      deploy: this.controls['deploy'].value,
      github: this.controls['github'].value,
      position: this.controls['position'].value,
      technology: this.controls['technology'].value
    };
  }

  get controls() {
    return this.projectForm.controls;
  }

}
