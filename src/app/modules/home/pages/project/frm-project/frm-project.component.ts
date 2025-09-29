import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TechnologyService } from '@app/home/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { ProjectService } from '@app/home/services/project.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ImageService } from '@app/home/services/images.service';
import { Technology } from '@app/home/interfaces/technology';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-frm-project',
  templateUrl: './frm-project.component.html',
  styleUrls: ['./frm-project.component.css'],
  standalone: false
})
export class FrmProjectComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
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
      this.buildForm(project.title, project.description, project.deploy, project.github, project.position, project.technology);
      return;
    }

    this.buildForm();
  }

  buildForm(title: string = '', description: string = '', deploy: string = '', github: string = '', position: number | null = null, technology: number | null = null): void {
    const validatorsImg = [this.parameter.imageFileValidator];

    if (!title) validatorsImg.push(Validators.required);

    this.projectForm = this.fb.group({
      title: [title, [Validators.required]],
      description: [description, [Validators.required]],
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
    this.technologyService.getTechnologyListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) this.technologyList = result.data;
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
    this.projectService.createProject(this.project).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  updateProject(): void {
    this.spinner.show();
    this.projectService.updateProject(this.config.data.project.id, this.project).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageInstitution(result.data);
          } else {
            this.close(result.data);
            this.spinner.hide();
          }
        } else {
          this.alert.resultWarnings(result);
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  uploadImageInstitution(project: Project): void {
    this.imageService.uploadImageProject(project.id!, this.controls['image'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.close(project);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
      description: this.controls['description'].value,
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
