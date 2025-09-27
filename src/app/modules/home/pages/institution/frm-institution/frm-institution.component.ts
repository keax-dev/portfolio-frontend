import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InstitutionService } from '@app/home/services/institution.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '@app/shared/services/alert.service';
import { ImageService } from '@app/home/services/images.service';
import { Institution } from '@app/home/interfaces/Institution';

@Component({
  selector: 'app-frm-institution',
  templateUrl: './frm-institution.component.html',
  styleUrls: ['./frm-institution.component.css'],
  standalone: false
})
export class FrmInstitutionComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private institutionService = inject(InstitutionService);
  private imageService = inject(ImageService);
  private spinner = inject(NgxSpinnerService);
  private config = inject(DynamicDialogConfig);
  private alert = inject(AlertService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  institutionForm!: FormGroup;
  tittle = 'New Institution';

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
    this.institutionForm = this.fb.group({
      name: ['', [Validators.required]],
      image: [null, [Validators.required, this.imageFileValidator]]
    });

    if (this.config.data) {
      this.update = true;
      this.urlImage = this.config.data.url;
      this.institutionForm = this.fb.group({
        name: [this.config.data.name, [Validators.required]],
        image: [null, [this.imageFileValidator]]
      });
    }
  }

  ngSubmit(): void {
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
    this.institutionService.createInstitution({ name: this.controls['name'].value }).pipe(takeUntil(this.destroy$)).subscribe({
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

  updateInstitution(): void {
    this.spinner.show();
    this.institutionService.updateInstitution(this.config.data.id, { name: this.controls['name'].value }).pipe(takeUntil(this.destroy$)).subscribe({
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

  uploadImageInstitution(institution: Institution): void {
    this.imageService.uploadImageInstitution(institution.id!, this.controls['image'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.close(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.close(institution);
        }
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

  imageFileValidator(control: AbstractControl): ValidationErrors | null {
    const file: File = control.value;
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      return allowedTypes.includes(file.type) ? null : { invalidFileType: true };
    }
    return null;
  }

  close(institution?: Institution): void {
    this.ref.close(institution);
  }

  get controls() {
    return this.institutionForm.controls;
  }

}
