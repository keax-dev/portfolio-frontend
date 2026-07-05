import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UppercaseDirective } from '@shared/components/directive/uppercase.directive';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ProfileService } from '@features/admin/services/profile.service';
import { AlertService } from '@core/services/alert.service';
import { ImageService } from '@features/admin/services/images.service';
import { Profile } from '@shared/interfaces/profile';
import { finalize } from 'rxjs';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-frm-profile',
  templateUrl: './frm-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective, ButtonComponent],
})
export class FrmProfileComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly profileService = inject(ProfileService);
  private readonly imageService = inject(ImageService);
  private readonly parameter = inject(ParameterService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly alert = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  readonly profileForm = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    last_name: this.fb.nonNullable.control('', Validators.required),
    title: this.fb.nonNullable.control('', Validators.required),
    title_es: this.fb.nonNullable.control('', Validators.required),
    cv: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^https?:\/\//i)]),
    image: this.fb.control<File | null>(null, [
      Validators.required,
      this.parameter.imageFileValidator,
    ]),
  });

  readonly previousProfile = signal<Profile | null>(null);
  readonly urlPicture = signal('');
  readonly title = signal('New Profile');
  readonly update = signal(false);

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadVariables(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.spinner.show();
    this.profileService
      .getProfile()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.previousProfile.set(result.data);
          this.loadVariablesUpdate(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  loadVariablesUpdate(data: Profile): void {
    this.title.set('Update Profile');
    this.update.set(true);
    this.urlPicture.set(data.image ?? '');
    this.profileForm.patchValue({
      name: data.name,
      last_name: data.last_name,
      title: data.title,
      title_es: data.title_es,
      cv: data.cv,
    });
    this.controls.image.setValidators([this.parameter.imageFileValidator]);
    this.controls.image.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (this.update()) {
      this.updateProfile();
      return;
    }

    this.createProfile();
  }

  updateProfile(): void {
    this.spinner.show();
    this.profileService
      .updateProfile(this.profile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageProfile(result.data);
            return;
          }

          this.previousProfile.set(result.data);
          this.spinner.hide();
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  createProfile(): void {
    this.spinner.show();
    this.profileService
      .createProfile(this.profile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          if (this.controls['image'].value) {
            this.uploadImageProfile(result.data, true);
            return;
          }

          this.previousProfile.set(result.data);
          this.spinner.hide();
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  uploadImageProfile(profile: Profile, create?: boolean): void {
    this.spinner.show();
    const image = this.controls.image.value;
    if (!image) {
      this.spinner.hide();
      return;
    }

    this.imageService
      .uploadImageProfile(image)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.previousProfile.set(result.data);
          this.urlPicture.set(result.data.image ?? '');
          if (create) this.loadVariablesUpdate(result.data);
        },
        error: (error) => {
          this.previousProfile.set(profile);
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

  cancel(): void {
    const previousProfile = this.previousProfile();
    if (previousProfile) {
      this.profileForm.patchValue({ ...previousProfile, image: null });
    }
  }

  get profile() {
    const value = this.profileForm.getRawValue();
    return {
      name: value.name,
      last_name: value.last_name,
      title: value.title,
      title_es: value.title_es,
      cv: value.cv,
    };
  }

  get controls(): typeof this.profileForm.controls {
    return this.profileForm.controls;
  }
}
