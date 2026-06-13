import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { InstitutionService } from '@features/admin/services/institution.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Institution } from '@shared/interfaces/institution';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-frm-institution',
    templateUrl: './frm-institution.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, ButtonComponent]
})
export class FrmInstitutionComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private institutionService = inject(InstitutionService);
  private imageService = inject(ImageService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  institutionForm!: FormGroup;
  urlImage!: string;
  title = 'New Institution';

  update!: boolean;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.config.data) {
      this.update = true;
      this.urlImage = this.config.data.url;
      this.title = 'Update Institution';
      this.buildForm(this.config.data.name, this.config.data.name_es);
      return;
    }

    this.buildForm();
  }

  buildForm(name = '', nameEs = ''): void {
    const validatorsImg = [this.parameter.imageFileValidator];

    if (!name) validatorsImg.push(Validators.required);

    this.institutionForm = this.fb.group({
      name: [name, [Validators.required]],
      name_es: [nameEs, [Validators.required]],
      image: [null, validatorsImg]
    });
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
    this.institutionService.createInstitution(this.valuesName).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.uploadImageInstitution(result.data);
      },
      error: error => this.alert.httpError(error)
    });
  }

  updateInstitution(): void {
    this.spinner.show();
    this.institutionService.updateInstitution(this.config.data.id, this.valuesName).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  uploadImageInstitution(institution: Institution): void {
    this.imageService.uploadImageInstitution(institution.id!, this.controls['image'].value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.close(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => {
        this.close(institution);
        this.alert.httpError(error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.institutionForm.get('image')?.setValue(input.files[0]);
    }
  }

  close(institution?: Institution): void {
    this.ref.close(institution);
  }

  get controls() {
    return this.institutionForm.controls;
  }

  get valuesName() {
    return {
      name: this.controls['name'].value,
      name_es: this.controls['name_es'].value
    }
  }

}
