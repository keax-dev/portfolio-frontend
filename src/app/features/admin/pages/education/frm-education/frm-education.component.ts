import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InstitutionService } from '@features/admin/services/institution.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EducationService } from '@features/admin/services/education.service';
import { AlertService } from '@core/services/alert.service';
import { Institution } from '@shared/models/institution';
import { Education } from '@shared/models/education';

@Component({
  selector: 'app-frm-education',
  templateUrl: './frm-education.component.html',
  standalone: false
})
export class FrmEducationComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private institutionService = inject(InstitutionService);
  private educationService = inject(EducationService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  educationForm!: FormGroup;

  institutionList: Institution[] = [];
  positionList: number[] = [];
  title = 'New Education';

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
    this.educationForm = this.fb.group({
      title: ['', [Validators.required]],
      title_es: ['', [Validators.required]],
      institution: [null, [Validators.required]],
      place: ['', [Validators.required]],
      place_es: ['', [Validators.required]],
      start: [''],
      start_es: [''],
      end: ['', [Validators.required]],
      end_es: ['', [Validators.required]],
      position: [null, [Validators.required]]
    });

    this.positionList = Array.from({ length: this.config.data.positions }, (_, i) => i + 1);

    if (this.config.data.education) {
      this.update = true;
      this.title = 'Update Education';
      this.educationForm.patchValue(this.config.data.education);
    }

    this.getInstitutionListByDeleted();
  }

  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateEducation();
      return;
    }

    this.createEducation();
  }

  createEducation(): void {
    this.spinner.show();
    this.educationService.createEducation(this.educationForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  updateEducation(): void {
    this.spinner.show();
    this.educationService.updateEducation(this.config.data.education.id, this.educationForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  getInstitutionListByDeleted(): void {
    this.spinner.show();
    this.institutionService.getInstitutionListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => this.institutionList = result.data,
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  close(education?: Education): void {
    this.ref.close(education);
  }

  get controls() {
    return this.educationForm.controls;
  }

}
