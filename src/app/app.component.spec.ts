/**
 * Pruebas unitarias del componente raíz y su configuración mínima de renderizado.
 */
import { provideRouter } from '@angular/router';
import { AppComponent } from '@src/app.component';
import { TestBed } from '@angular/core/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  // Caso: crea la aplicación.
  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
