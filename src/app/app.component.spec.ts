/**
 * Pruebas unitarias del componente raíz y su configuración mínima de renderizado.
 */
import { TranslateService } from '@core/services/translate.service';
import { provideRouter } from '@angular/router';
import { AppComponent } from '@src/app.component';
import { TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
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

  // Caso: sincroniza el idioma actual con el atributo lang del documento.
  it('syncs the current language with the document lang attribute', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const translate = TestBed.inject(TranslateService);

    fixture.detectChanges();
    expect(document.documentElement.lang).toBe('es');

    translate.setLang = 'en';
    fixture.detectChanges();

    expect(document.documentElement.lang).toBe('en');
  });
});
