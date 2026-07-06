/**
 * Pruebas unitarias de validación, autenticación y persistencia desde LoginComponent.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { UserInfoService } from '@core/services/user-info.service';
import { LoginComponent } from './login.component';
import { LoginService } from '@features/auth/services/login.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let loginService: { login: ReturnType<typeof vi.fn> };
  let spinner: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  let alert: {
    success: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let userInfo: {
    setToken: string;
    setTimeExpiration: number;
    resolveTokenExpiration: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    loginService = { login: vi.fn() };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { success: vi.fn(), httpError: vi.fn() };
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    userInfo = {
      setToken: '',
      setTimeExpiration: 0,
      resolveTokenExpiration: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: LoginService, useValue: loginService },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
        { provide: Router, useValue: router },
        { provide: UserInfoService, useValue: userInfo },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.restoreAllMocks());

  // Caso: define las reglas esperadas de validación de credenciales.
  it('defines the expected credential validation rules', () => {
    component.authForm.setValue({ username: '', password: 'abc' });
    expect(component.controls.username.hasError('required')).toBe(true);
    expect(component.controls.password.hasError('minlength')).toBe(true);

    component.authForm.setValue({
      username: 'a'.repeat(26),
      password: 'a'.repeat(26),
    });
    expect(component.controls.username.hasError('maxlength')).toBe(true);
    expect(component.controls.password.hasError('maxlength')).toBe(true);
  });

  // Caso: marca un formulario inválido y no llama a la API.
  it('marks an invalid form and does not call the API', () => {
    component.onSubmit();
    expect(component.controls.username.touched).toBe(true);
    expect(component.controls.password.touched).toBe(true);
    expect(loginService.login).not.toHaveBeenCalled();
  });

  // Caso: inicia sesión, guarda el estado y navega al home.
  it('logs in, stores the session and navigates home', () => {
    component.authForm.setValue({ username: 'admin', password: 'secret' });
    loginService.login.mockReturnValue(
      of({
        status: true,
        alert: 'Welcome',
        data: { token: 'jwt-token' },
      }),
    );
    userInfo.resolveTokenExpiration.mockReturnValue(2_000_000);

    component.onSubmit();

    expect(spinner.show).toHaveBeenCalledOnce();
    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(loginService.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
    });
    expect(alert.success).toHaveBeenCalledWith('Welcome');
    expect(userInfo.setToken).toBe('jwt-token');
    expect(userInfo.setTimeExpiration).toBe(2_000_000);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  // Caso: usa una expiración alternativa cuando el token no tiene claim exp.
  it('uses a fallback expiration when the token has no exp claim', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    userInfo.resolveTokenExpiration.mockReturnValue(null);

    component.saveUserInfo({ token: 'opaque-token' });

    expect(userInfo.setTimeExpiration).toBe(14_001_000);
  });

  // Caso: reporta errores de login y siempre oculta el spinner.
  it('reports login errors and always hides the spinner', () => {
    const failure = new Error('invalid credentials');
    component.authForm.setValue({ username: 'admin', password: 'wrong' });
    loginService.login.mockReturnValue(throwError(() => failure));

    component.onSubmit();

    expect(alert.httpError).toHaveBeenCalledWith(failure);
    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // Caso: oculta el spinner al destruirse.
  it('hides the spinner on destruction', () => {
    component.ngOnDestroy();
    expect(spinner.hide).toHaveBeenCalledOnce();
  });
});
