/**
 * Pruebas unitarias del ciclo de vida y expiración automática de notificaciones.
 */
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new NotificationService();
  });

  afterEach(() => vi.useRealTimers());

  // Caso: agrega notificaciones con identificadores crecientes.
  it('adds notifications with increasing identifiers', () => {
    service.show('success', 'Saved', 'Success');
    service.show('warning', 'Careful', 'Warning');

    expect(service.notifications()).toEqual([
      { id: 1, kind: 'success', message: 'Saved', title: 'Success' },
      { id: 2, kind: 'warning', message: 'Careful', title: 'Warning' },
    ]);
  });

  // Caso: descarta una notificación de forma explícita.
  it('dismisses a notification explicitly', () => {
    service.show('info', 'Hello', 'Message');
    service.dismiss(1);
    expect(service.notifications()).toEqual([]);
  });

  // Caso: descarta automáticamente una notificación después de cinco segundos.
  it('automatically dismisses a notification after five seconds', () => {
    service.show('error', 'Failed', 'Error');
    vi.advanceTimersByTime(4_999);
    expect(service.notifications()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(service.notifications()).toEqual([]);
  });
});
