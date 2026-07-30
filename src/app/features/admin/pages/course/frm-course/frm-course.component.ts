import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { AlertService } from '@core/services/alert.service';
import { imageFileValidator } from '@core/validators/image-file.validator';
import { persistWithOptionalFile } from '@features/admin/persistence/persist-with-file';
import { CourseService } from '@features/admin/services/course.service';
import { ImageService } from '@features/admin/services/images.service';
import { InstitutionService } from '@features/admin/services/institution.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { Course } from '@shared/interfaces/course';
import { Institution } from '@shared/interfaces/institution';
import { finalize, Observable } from 'rxjs';

interface CourseDialogData {
  readonly course?: Course;
  readonly nextPosition?: number;
}

@Component({
  selector: 'app-frm-course',
  templateUrl: './frm-course.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    UppercaseDirective,
    ButtonComponent,
  ],
})
export class FrmCourseComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly courseService = inject(CourseService);
  private readonly institutionService = inject(InstitutionService);
  private readonly imageService = inject(ImageService);
  private readonly alert = inject(AlertService);
  private readonly data = inject<CourseDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<unknown, Course>>(MatDialogRef);
  private readonly fb = inject(FormBuilder);

  readonly courseForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(200)]),
    name_en: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(200)]),
    certificate_url: this.fb.nonNullable.control('', [
      Validators.maxLength(2048),
      Validators.pattern(/^https?:\/\/.+/i),
    ]),
    position: this.fb.nonNullable.control(
      this.data.course?.position ?? this.data.nextPosition ?? 1,
      [Validators.required, Validators.min(1)],
    ),
    institution: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    image: this.fb.control<File | null>(null, [
      imageFileValidator(),
      ...(this.data.course ? [] : [Validators.required]),
    ]),
  });

  readonly institutionList = signal<readonly Institution[]>([]);
  readonly isSaving = signal(false);
  readonly isLoadingInstitutions = signal(false);
  readonly isUpdate = Boolean(this.data.course);
  readonly title = this.isUpdate ? 'Update Course / Certificate' : 'New Course / Certificate';
  readonly currentCertificateImg = this.data.course?.certificate_img ?? '';

  ngOnInit(): void {
    if (this.data.course) {
      this.courseForm.patchValue({
        name: this.data.course.name,
        name_en: this.data.course.name_en,
        certificate_url: this.data.course.certificate_url ?? '',
        position: this.data.course.position,
        institution: this.data.course.institution,
      });
    }
    this.loadInstitutions();
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    persistWithOptionalFile(this.persistMetadata(), this.controls.image.value, (course, image) =>
      this.imageService.uploadCourseCertificate(course.id, image),
    )
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          result.successMessages.forEach((message) => this.alert.success(message));
          if (result.fileUploadError) {
            this.alert.httpError(result.fileUploadError);
          }
          this.close(result.entity);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  loadInstitutions(): void {
    this.isLoadingInstitutions.set(true);
    this.institutionService
      .getInstitutionList()
      .pipe(
        finalize(() => this.isLoadingInstitutions.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => this.institutionList.set(response.data),
        error: (error) => this.alert.httpError(error),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.controls.image.setValue(input.files?.item(0) ?? null);
    this.controls.image.markAsTouched();
    this.controls.image.updateValueAndValidity();
  }

  close(course?: Course): void {
    this.ref.close(course);
  }

  get controls(): typeof this.courseForm.controls {
    return this.courseForm.controls;
  }

  private persistMetadata(): Observable<ApiResponse<Course>> {
    const payload = {
      name: this.controls.name.value,
      name_en: this.controls.name_en.value,
      certificate_url: this.controls.certificate_url.value.trim() || undefined,
      position: this.controls.position.value,
      institution: this.controls.institution.value,
    };

    return this.data.course
      ? this.courseService.updateCourse(this.data.course.id, payload)
      : this.courseService.createCourse(payload);
  }
}
