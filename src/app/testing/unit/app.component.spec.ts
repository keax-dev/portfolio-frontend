/**
 * Pruebas unitarias del componente raíz y la sincronización del idioma del documento.
 */
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { TranslateService } from '@core/services/translate.service';
import { AppComponent } from '@src/app.component';
import { TestBed } from '@angular/core/testing';

@Component({
  standalone: true,
  template: '',
})
class EmptyRouteComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: '', component: EmptyRouteComponent },
          { path: 'login', component: EmptyRouteComponent },
          { path: 'home', component: EmptyRouteComponent },
        ]),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Caso: crea la aplicación.
  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Caso: sincroniza el idioma público actual con el atributo lang del documento.
  it('syncs the public language with the document lang attribute', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const translate = TestBed.inject(TranslateService);

    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('es');

    translate.setLang = 'en';
    fixture.detectChanges();

    expect(document.documentElement.lang).toBe('en');
  });

  // Caso: fuerza inglés al salir del portfolio público aunque el usuario haya elegido español.
  it('forces English outside of the public portfolio route', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    const translate = TestBed.inject(TranslateService);

    translate.setLang = 'es';
    fixture.detectChanges();

    await router.navigateByUrl('/login');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.documentElement.lang).toBe('en');
  });
});
