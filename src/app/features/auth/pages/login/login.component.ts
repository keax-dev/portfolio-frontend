import {
  Component,
  inject,
  DestroyRef,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserInfoService } from '@core/services/user-info.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoginResponse } from '@features/auth/interfaces/auth';
import { LoginService } from '@features/auth/services/login.service';
import { AlertService } from '@core/services/alert.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent],
})
export class LoginComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userInfoService = inject(UserInfoService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly authForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
  });

  readonly isSubmitting = signal(false);
  hide = true;

  ngOnDestroy(): void {
    this.isSubmitting.set(false);
  }

  onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginService
      .login(this.authForm.getRawValue())
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.saveUserInfo(result.data);
        },
        error: (error) => this.alert.httpError(error),
      });
  }

  saveUserInfo(data: LoginResponse): void {
    const expiration = this.resolveSessionExpiration(data.token);
    if (!expiration) {
      this.userInfoService.clearInfo();
      this.alert.error('The token does not include a valid expiration date.', 'Unauthorized');
      return;
    }

    this.userInfoService.setSession(data.token, expiration);
    void this.router.navigateByUrl('/home/visitor-dashboard');
  }

  resolveSessionExpiration(token: string): number | null {
    const expiration = this.userInfoService.resolveTokenExpiration(token);
    if (!expiration || expiration <= Date.now()) {
      return null;
    }

    return expiration;
  }

  get controls(): typeof this.authForm.controls {
    return this.authForm.controls;
  }

  usernameErrorMessage(): string {
    const control = this.controls.username;
    if (control.hasError('required')) {
      return 'The username is required';
    }

    if (control.hasError('maxlength')) {
      return 'The username cannot exceed 25 characters';
    }

    return '';
  }

  passwordErrorMessage(): string {
    const control = this.controls.password;
    if (control.hasError('required')) {
      return 'The password is required';
    }

    if (control.hasError('minlength')) {
      return 'The password must have at least 4 characters';
    }

    if (control.hasError('maxlength')) {
      return 'The password cannot exceed 25 characters';
    }

    return '';
  }

  authTitle(): string {
    return 'Login';
  }

  usernameLabel(): string {
    return 'Username';
  }

  passwordLabel(): string {
    return 'Password';
  }

  passwordVisibilityLabel(): string {
    return this.hide ? 'Show password' : 'Hide password';
  }

  loginActionLabel(): string {
    return 'Login';
  }

  loggingInLabel(): string {
    return 'Signing in...';
  }
}
