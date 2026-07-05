/**
 * Pruebas unitarias de validación de imágenes y configuración responsive de diálogos.
 */
import { BreakpointObserver } from '@angular/cdk/layout';
import { Dialog } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ParameterService } from './parameter.service';

describe('ParameterService', () => {
  let service: ParameterService;
  let breakpoint: { isMatched: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    breakpoint = { isMatched: vi.fn().mockReturnValue(false) };
    dialog = { open: vi.fn().mockReturnValue({}) };
    TestBed.configureTestingModule({
      providers: [
        ParameterService,
        { provide: BreakpointObserver, useValue: breakpoint },
        { provide: Dialog, useValue: dialog },
      ],
    });
    service = TestBed.inject(ParameterService);
  });

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each(['image/png', 'image/jpeg', 'image/gif'])('accepts %s images', (type) => {
    const control = new FormControl(new File(['image'], 'image', { type }));
    expect(service.imageFileValidator(control)).toBeNull();
  });

  // Caso: rejects unsupported file types.
  it('rejects unsupported file types', () => {
    const control = new FormControl(new File(['text'], 'file.txt', { type: 'text/plain' }));
    expect(service.imageFileValidator(control)).toEqual({ invalidFileType: true });
  });

  // Caso: ignores empty and non-file values.
  it('ignores empty and non-file values', () => {
    expect(service.imageFileValidator(new FormControl(null))).toBeNull();
    expect(service.imageFileValidator(new FormControl('image.png'))).toBeNull();
  });

  // Caso: uses responsive default widths.
  it('uses responsive default widths', () => {
    expect(service.getModalWidth).toBe('45%');
    breakpoint.isMatched.mockReturnValue(true);
    expect(service.getModalWidth).toBe('90%');
  });

  // Caso: uses the supplied desktop and mobile widths.
  it('uses the supplied desktop and mobile widths', () => {
    expect(service.getModalWidthByParameters('30%', '95%')).toBe('30%');
    breakpoint.isMatched.mockReturnValue(true);
    expect(service.getModalWidthByParameters('30%', '95%')).toBe('95%');
  });

  // Caso: opens a dialog with data, sizing and accessibility options.
  it('opens a dialog with data, sizing and accessibility options', () => {
    class DialogContent {}
    const data = { id: 1 };
    service.openDialog(DialogContent, data, '40%', '90%');

    expect(dialog.open).toHaveBeenCalledWith(
      DialogContent,
      expect.objectContaining({
        data,
        width: '40%',
        maxWidth: '100vw',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
      }),
    );
  });
});
