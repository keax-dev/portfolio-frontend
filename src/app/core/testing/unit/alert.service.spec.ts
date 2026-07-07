/**
 * Pruebas unitarias del mapeo de alertas, errores HTTP y confirmaciones destructivas.
 */
import { NotificationService } from '@core/notifications/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '@core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('AlertService', () => {
  let service: AlertService;
  let notifications: { show: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    notifications = { show: vi.fn() };
    dialog = { open: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: NotificationService, useValue: notifications },
        { provide: MatDialog, useValue: dialog },
      ],
    });
    service = TestBed.inject(AlertService);
  });

  // Caso: delega las notificaciones tipadas con sus títulos por defecto.
  it('delegates typed notifications with their default titles', () => {
    service.success('Saved');
    service.info('Hello');
    service.warning('Careful');
    service.error('Failed');

    expect(notifications.show).toHaveBeenNthCalledWith(1, 'success', 'Saved', 'Success');
    expect(notifications.show).toHaveBeenNthCalledWith(2, 'info', 'Hello', 'Information');
    expect(notifications.show).toHaveBeenNthCalledWith(3, 'warning', 'Careful', 'Warning');
    expect(notifications.show).toHaveBeenNthCalledWith(4, 'error', 'Failed', 'An error occurred');
  });

  // Caso: usa un texto personalizado para errores de aplicación.
  it('uses custom application error text', () => {
    service.applicationError('Custom failure', 'Custom title');
    expect(notifications.show).toHaveBeenCalledWith('error', 'Custom failure', 'Custom title');
  });

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each([
    [400, 'Review the submitted information', 'Invalid request'],
    [401, 'Your session is not valid', 'Unauthorized'],
    [403, 'You do not have permission to perform this action', 'Forbidden'],
    [404, 'The requested resource was not found', 'Not found'],
    [409, 'The operation conflicts with existing data', 'Conflict'],
    [500, 'Please try again later', 'Server error'],
    [0, 'Could not connect to the server', 'Connection error'],
    [418, 'Contact support', 'An error occurred'],
  ])('maps HTTP status %s to a useful notification', (status, message, title) => {
    service.httpError(new HttpErrorResponse({ status }));
    expect(notifications.show).toHaveBeenCalledWith('error', message, title);
  });

  // Caso: muestra advertencias del backend y el texto de alerta desde una respuesta API válida.
  it('shows backend warnings and alert text from a valid API response', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        status: false,
        alert: 'Validation failed',
        messages: ['Name is required', 42],
      },
    });

    service.httpError(error);

    expect(notifications.show).toHaveBeenCalledWith('warning', 'Name is required', 'Warning');
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Validation failed',
      'Invalid request',
    );
  });

  // Caso: usa un mensaje alternativo para errores que no son HTTP.
  it('uses a fallback for non-HTTP errors', () => {
    service.httpError(new Error('boom'), 'Operation failed');
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Operation failed',
      'An error occurred',
    );
  });

  // Caso: ejecuta una acción de eliminación solo después de confirmar.
  it('executes a delete action only after confirmation', () => {
    const action = vi.fn();
    dialog.open.mockReturnValue({ afterClosed: () => of(true) });

    service.confirmDelete(action);

    expect(action).toHaveBeenCalledOnce();
    expect(dialog.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: expect.objectContaining({ confirmLabel: 'Confirm' }),
      }),
    );
  });

  // Caso: no ejecuta una acción de eliminación cuando se cancela la confirmación.
  it('does not execute a delete action when confirmation is cancelled', () => {
    const action = vi.fn();
    dialog.open.mockReturnValue({ afterClosed: () => of(false) });
    service.confirmDelete(action);
    expect(action).not.toHaveBeenCalled();
  });
});
