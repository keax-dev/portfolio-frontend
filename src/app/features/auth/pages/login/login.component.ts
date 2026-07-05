import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, DestroyRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoService } from '@core/services/user-info.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoginService } from '@features/auth/services/login.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { LoginResponse } from '@features/auth/interfaces/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent],
})
export class LoginComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fallbackSessionMs = 14_000_000;

  private readonly userInfoService = inject(UserInfoService);
  private readonly loginService = inject(LoginService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly authForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
  });

  hide = true;

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.loginService
      .login(this.authForm.getRawValue())
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.saveUserInfo(result.data);
        },
        error: (error) => this.alert.httpError(error, undefined, false),
      });
  }

  saveUserInfo(data: LoginResponse): void {
    this.userInfoService.setToken = data.token;
    this.userInfoService.setTimeExpiration =
      this.userInfoService.resolveTokenExpiration(data.token) ??
      Date.now() + this.fallbackSessionMs;
    void this.router.navigateByUrl('/home');
  }

  get controls(): typeof this.authForm.controls {
    return this.authForm.controls;
  }
}
