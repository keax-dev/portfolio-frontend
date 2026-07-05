import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { InstitutionService } from '@features/admin/services/institution.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Institution } from '@shared/interfaces/institution';
import { finalize } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-frm-institution',
  templateUrl: './frm-institution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, ButtonComponent],
})
export class FrmInstitutionComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly institutionService = inject(InstitutionService);
  private readonly imageService = inject(ImageService);
  private readonly parameter = inject(ParameterService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly data = inject<Institution | null>(DIALOG_DATA);
  private readonly alert = inject(AlertService);
  private readonly ref = inject<DialogRef<Institution>>(DialogRef);
  private readonly fb = inject(FormBuilder);

  readonly institutionForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    name_es: this.fb.nonNullable.control('', Validators.required),
    image: this.fb.control<File | null>(null, [
      this.parameter.imageFileValidator,
      ...(this.data ? [] : [Validators.required]),
    ]),
  });

  urlImage = '';
  title = 'New Institution';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.data) {
      this.update = true;
      this.urlImage = this.data.url ?? '';
      this.title = 'Update Institution';
      this.institutionForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.institutionForm.invalid) {
      this.institutionForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateInstitution();
      return;
    }

    this.createInstitution();
  }

  createInstitution(): void {
    this.spinner.show();
    this.institutionService
      .createInstitution(this.valuesName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  updateInstitution(): void {
    this.spinner.show();
    this.institutionService
      .updateInstitution(this.data!.id!, this.valuesName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageInstitution(result.data);
            return;
          }

          this.close(result.data);
          this.spinner.hide();
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  uploadImageInstitution(institution: Institution): void {
    const image = this.controls.image.value;
    if (!image) {
      this.spinner.hide();
      return;
    }

    this.imageService
      .uploadImageInstitution(institution.id!, image)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.close(result.data);
        },
        error: (error) => {
          this.close(institution);
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
}
