import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstitutionService } from '@app/home/services/institution.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@app/home/services/translate.service';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ImageService } from '@app/home/services/images.service';
import { Institution } from '@app/home/interfaces/institution';

@Component({
  selector: 'app-frm-institution',
  templateUrl: './frm-institution.component.html',
  standalone: false
})
export class FrmInstitutionComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private institutionService = inject(InstitutionService);
  private translateService = inject(TranslateService);
  private imageService = inject(ImageService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  institutionForm!: FormGroup;
  title = 'New Institution';

  update!: boolean;
  urlImage!: string;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  loadVariables(): void {
    if (this.config.data) {
      this.update = true;
      this.urlImage = this.config.data.url;
      this.title = 'Update Institution';
      this.buildForm(this.config.data.name);
      return;
    }

    this.buildForm();
  }

  buildForm(name: string = ''): void {
    const validatorsImg = [this.parameter.imageFileValidator];

    if (!name) validatorsImg.push(Validators.required);

    this.institutionForm = this.fb.group({
      name: [name, [Validators.required]],
      name_es: [''],
      image: [null, validatorsImg]
    });
  }

  onSubmit(): void {
    if (this.institutionForm.invalid) {
      this.institutionForm.markAllAsTouched();
      return;
    }

    this.translateName();
  }

  translateName(): void {
    this.spinner.show();
    this.translateService.translate(this.controls['name'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.controls['name_es'].patchValue(result.data.translations[0].translatedText);

        if (this.update) {
          this.updateInstitution();
          return;
        }

        this.createInstitution();
      },
      error: () => this.alert.applicationError()
    });
  }

  createInstitution(): void {
    this.spinner.show();
    this.institutionService.createInstitution({ name: this.controls['name'].value, name_es: this.controls['name_es'].value }).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.uploadImageInstitution(result.data);
          return;
        }

        this.alert.resultWarnings(result);
        this.spinner.hide();
      },
      error: () => this.alert.applicationError()
    });
  }

  updateInstitution(): void {
    this.spinner.show();
    this.institutionService.updateInstitution(this.config.data.id, { name: this.controls['name'].value, name_es: this.controls['name_es'].value }).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (!result.status) {
          this.alert.resultWarnings(result);
          this.spinner.hide();
          return;
        }

        this.alert.success(result.alert);
        if (this.controls['image'].value) {
          this.uploadImageInstitution(result.data);
          return;
        }

        this.close(result.data);
        this.spinner.hide();
      },
      error: () => this.alert.applicationError()
    });
  }

  uploadImageInstitution(institution: Institution): void {
    this.imageService.uploadImageInstitution(institution.id!, this.controls['image'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
          return;
        }

        this.alert.resultWarnings(result);
        this.close(institution);
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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

}
