/**
 * Pruebas unitarias de validación, autenticación y persistencia desde LoginComponent.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let alert: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let userInfo: {
    setSession: ReturnType<typeof vi.fn>;
    clearInfo: ReturnType<typeof vi.fn>;
    resolveTokenExpiration: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    loginService = { login: vi.fn() };
    alert = { success: vi.fn(), error: vi.fn(), httpError: vi.fn() };
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    userInfo = {
      setSession: vi.fn(),
      clearInfo: vi.fn(),
      resolveTokenExpiration: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: LoginService, useValue: loginService },
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
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
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

    expect(component.isSubmitting()).toBe(false);
    expect(loginService.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
    });
    expect(alert.success).toHaveBeenCalledWith('Welcome');
    expect(userInfo.setSession).toHaveBeenCalledWith('jwt-token', 2_000_000);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  // Caso: rechaza tokens sin expiración válida y evita persistir una sesión insegura.
  it('rejects tokens without a valid expiration and avoids storing the session', () => {
    userInfo.resolveTokenExpiration.mockReturnValue(null);

    component.saveUserInfo({ token: 'opaque-token' });

    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.error).toHaveBeenCalledOnce();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // Caso: reporta errores de login y siempre restablece el estado de envío.
  it('reports login errors and always resets the submit state', () => {
    const failure = new Error('invalid credentials');
    component.authForm.setValue({ username: 'admin', password: 'wrong' });
    loginService.login.mockReturnValue(throwError(() => failure));

    component.onSubmit();

    expect(alert.httpError).toHaveBeenCalledWith(failure);
    expect(component.isSubmitting()).toBe(false);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // Caso: limpia el estado de envío al destruirse.
  it('clears the submit state on destruction', () => {
    component.isSubmitting.set(true);
    component.ngOnDestroy();
    expect(component.isSubmitting()).toBe(false);
  });
});
