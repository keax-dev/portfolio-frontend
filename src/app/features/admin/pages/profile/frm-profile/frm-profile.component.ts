import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ProfileService } from '@features/admin/services/profile.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Profile } from '@shared/models/profile';
import { UppercaseDirective } from '../../../../../shared/components/directive/uppercase.directive';
import { InputText } from 'primeng/inputtext';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
    selector: 'app-frm-profile',
    templateUrl: './frm-profile.component.html',
    imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, InputText, ButtonComponent]
})
export class FrmProfileComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private profileService = inject(ProfileService);
  private imageService = inject(ImageService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;

  previousProfile!: Profile;
  urlPicture!: string;
  title = 'New Profile';

  update = false;

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      title_es: ['', [Validators.required]],
      cv: ['', [Validators.required]],
      image: [null, [Validators.required, this.parameter.imageFileValidator]]
    });

    this.previousProfile = {
      name: '',
      last_name: '',
      title: '',
      title_es: '',
      cv: '',
      image: null
    };

    this.getProfile();
  }

  getProfile(): void {
    this.spinner.show();
    this.profileService.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.previousProfile = result.data;
        this.loadVariablesUpdate(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  loadVariablesUpdate(data: Profile): void {
    this.title = 'Update Profile';
    this.update = true;
    this.urlPicture = data.image!;
    delete data.image;
    this.profileForm.patchValue(data);
    const imageControl = this.profileForm.get('image');
    imageControl?.clearValidators();
    imageControl?.setValidators([this.parameter.imageFileValidator]);
    imageControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (this.update) {
      this.updateProfile();
      return;
    }

    this.createProfile();
  }

  updateProfile(): void {
    this.profileService.updateProfile(this.profile).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        if (this.controls['image'].value) {
          this.uploadImageProfile(result.data);
          return;
        }

        this.previousProfile = result.data;
        this.spinner.hide();
      },
      error: error => this.alert.httpError(error)
    });
  }

  createProfile(): void {
    this.spinner.show();
    this.profileService.createProfile(this.profile).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        if (this.controls['image'].value) {
          this.uploadImageProfile(result.data, true);
          return;
        }

        this.previousProfile = result.data;
        this.spinner.hide();
      },
      error: error => this.alert.httpError(error)
    });
  }

  uploadImageProfile(profile: Profile, create?: boolean): void {
    this.spinner.show();
    this.imageService.uploadImageProfile(this.controls['image'].value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.previousProfile = result.data;
        this.urlPicture = result.data.image!;
        if (create) this.loadVariablesUpdate(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => {
        this.previousProfile = profile;
        this.alert.httpError(error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.profileForm.get('image')?.setValue(input.files[0]);
    }
  }

  cancel(): void {
    this.profileForm.patchValue({ ...this.previousProfile, image: null });
  }

  get profile() {
    return {
      name: this.controls['name'].value,
      last_name: this.controls['last_name'].value,
      title: this.controls['title'].value,
      title_es: this.controls['title_es'].value,
      cv: this.controls['cv'].value
    }
  }

  get controls() {
    return this.profileForm.controls;
  }

}
