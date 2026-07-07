import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstitutionService } from '@features/admin/services/institution.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerService } from 'ngx-spinner';
import { EducationService } from '@features/admin/services/education.service';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { Institution } from '@shared/interfaces/institution';
import { Education } from '@shared/interfaces/education';
import { finalize } from 'rxjs';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnDestroy,
  inject,
  OnInit,
  signal,
} from '@angular/core';

interface EducationDialogData {
  readonly positions: number;
  readonly education?: Education;
}

@Component({
  selector: 'app-frm-education',
  templateUrl: './frm-education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    UppercaseDirective,
    ButtonComponent,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
})
export class FrmEducationComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly institutionService = inject(InstitutionService);
  private readonly educationService = inject(EducationService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<EducationDialogData>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Education>>(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly educationForm = this.fb.group({
    title: ['', Validators.required],
    title_es: ['', Validators.required],
    institution: [0, [Validators.required, Validators.min(1)]],
    place: ['', Validators.required],
    start: [''],
    start_es: [''],
    end: ['', Validators.required],
    end_es: ['', Validators.required],
    position: [0, [Validators.required, Validators.min(1)]],
  });

  readonly institutionList = signal<readonly Institution[]>([]);
  readonly isSaving = signal(false);
  readonly positionList = Array.from({ length: this.data.positions }, (_, i) => i + 1);
  title = 'New Education';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.data.education) {
      this.update = true;
      this.title = 'Update Education';
      this.educationForm.patchValue(this.data.education);
    }

    this.getInstitutionListByDeleted();
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

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
    this.isSaving.set(true);
    this.educationService
      .createEducation(this.educationForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  updateEducation(): void {
    this.isSaving.set(true);
    this.educationService
      .updateEducation(this.data.education!.id!, this.educationForm.getRawValue())
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  getInstitutionListByDeleted(): void {
    this.spinner.show();
    this.institutionService
      .getInstitutionListByDeleted()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => this.institutionList.set(result.data),
        error: (error) => this.alert.httpError(error),
      });
  }

  close(education?: Education): void {
    this.ref.close(education);
  }

  get controls(): typeof this.educationForm.controls {
    return this.educationForm.controls;
  }
}
