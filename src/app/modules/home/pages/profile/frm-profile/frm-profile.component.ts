import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { ProfileService } from '@app/home/services/profile.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ImageService } from '@app/home/services/images.service';
import { Profile } from '@app/home/interfaces/profile';

@Component({
  selector: 'app-frm-profile',
  templateUrl: './frm-profile.component.html',
  styleUrls: ['./frm-profile.component.css'],
  standalone: false
})
export class FrmProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  loadVariables(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      cv: ['', [Validators.required]],
      image: [null, [Validators.required, this.parameter.imageFileValidator]]
    });

    this.previousProfile = {
      name: '',
      last_name: '',
      title: '',
      cv: '',
      image: null
    };

    this.getProfile();
  }

  getProfile(): void {
    this.spinner.show();
    this.profileService.getProfile().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.previousProfile = result.data;
          this.loadVariablesUpdate(result.data);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
    this.profileService.updateProfile(this.profile).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success('Profile updated successfully');
        if (this.controls['image'].value) {
          this.uploadImageProfile(result.data);
        } else {
          this.previousProfile = result.data;
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  createProfile(): void {
    this.spinner.show();
    this.profileService.createProfile(this.profile).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success('Profile created successfully');
        if (this.controls['image'].value) {
          this.uploadImageProfile(result.data, true);
        } else {
          this.previousProfile = result.data;
          this.spinner.hide();
        }
      },
      error: () => this.alert.applicationError()
    });
  }

  uploadImageProfile(profile: Profile, create?: boolean): void {
    this.spinner.show();
    this.imageService.uploadImageProfile(this.controls['image'].value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.previousProfile = result.data;
          this.urlPicture = result.data.image!;
          if (create) this.loadVariablesUpdate(result.data);
        } else {
          this.alert.resultWarnings(result);
          this.previousProfile = profile;
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
      cv: this.controls['cv'].value
    }
  }

  get controls() {
    return this.profileForm.controls;
  }

}
