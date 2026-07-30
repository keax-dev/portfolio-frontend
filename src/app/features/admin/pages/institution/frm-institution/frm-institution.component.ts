import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { InstitutionService } from '@features/admin/services/institution.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { imageFileValidator } from '@core/validators/image-file.validator';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatInputModule } from '@angular/material/input';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { persistWithOptionalFile } from '@features/admin/persistence/persist-with-file';
import { Institution } from '@shared/interfaces/institution';
import { Observable } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-frm-institution',
  templateUrl: './frm-institution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    UppercaseDirective,
    ButtonComponent,
    MatInputModule,
  ],
})
export class FrmInstitutionComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly institutionService = inject(InstitutionService);
  private readonly imageService = inject(ImageService);
  private readonly data = inject<Institution | null>(MAT_DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<MatDialogRef<unknown, Institution>>(MatDialogRef);
  private readonly fb = inject(FormBuilder);

  readonly institutionForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    name_es: this.fb.nonNullable.control('', Validators.required),
    image: this.fb.control<File | null>(null, [
      imageFileValidator(),
      ...(this.data ? [] : [Validators.required]),
    ]),
  });

  readonly isSaving = signal(false);
  readonly isUpdate = Boolean(this.data);
  readonly urlImage = this.data?.url ?? '';
  readonly title = this.isUpdate ? 'Update Institution' : 'New Institution';

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.data) {
      this.institutionForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.institutionForm.invalid) {
      this.institutionForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    persistWithOptionalFile(
      this.persistMetadata(),
      this.controls.image.value,
      (institution, image) => this.imageService.uploadImageInstitution(institution.id, image),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          result.successMessages.forEach((message) => this.alert.success(message));
          if (result.fileUploadError) {
            this.alert.httpError(result.fileUploadError);
          }
          this.close(result.entity);
          this.isSaving.set(false);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.alert.httpError(error);
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.controls.image.setValue(input.files[0]);
      this.controls.image.markAsTouched();
    }
  }

  close(institution?: Institution): void {
    this.ref.close(institution);
  }

  get controls(): typeof this.institutionForm.controls {
    return this.institutionForm.controls;
  }

  get valuesName() {
    const { name, name_es } = this.institutionForm.getRawValue();
    return { name, name_es };
  }

  private persistMetadata(): Observable<ApiResponse<Institution>> {
    return this.data
      ? this.institutionService.updateInstitution(this.data.id, this.valuesName)
      : this.institutionService.createInstitution(this.valuesName);
  }
}
