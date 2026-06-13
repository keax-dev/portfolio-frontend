import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoService } from '@core/services/user-info.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoginService } from '@features/auth/services/login.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';
import { Auth } from '@features/auth/interfaces/auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, ReactiveFormsModule, ButtonComponent]
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);
  private readonly fallbackSessionMs = 14_000_000;

  private userInfoService = inject(UserInfoService);
  private loginService = inject(LoginService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private alert = inject(AlertService);
  private fb = inject(FormBuilder);

  authForm!: FormGroup;

  hide = true;

  ngOnInit() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]]
    });
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.loginService.login(this.authForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.saveUserInfo(result.data);
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  saveUserInfo(data: Auth): void {
    this.userInfoService.setToken = data.token;
    this.userInfoService.setTimeExpiration = this.userInfoService.resolveTokenExpiration(data.token) ?? (Date.now() + this.fallbackSessionMs);
    void this.router.navigateByUrl("/home");
  }

  get controls() {
    return this.authForm.controls;
  }

}
