import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserInfoService } from '@app/shared/services/user-info.service';
import { HeaderService } from '@app/home/services/header.service';
import { LoginService } from '@app/login/services/login.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Router } from '@angular/router';
import { Auth } from '@app/login/interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private userInfoService = inject(UserInfoService);
  private headerService = inject(HeaderService);
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
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    this.loginService.login(this.authForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.saveUserInfo(result.data);
          return;
        }

        this.alert.resultWarnings(result);
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  saveUserInfo(data: Auth): void {
    this.userInfoService.setToken = data.token;
    this.userInfoService.setTimeExpiration = new Date(Date.now() + 14000000).getTime();
    this.headerService.loadHeaders();
    this.router.navigateByUrl("/home");
  }

  get controls() {
    return this.authForm.controls;
  }

}
