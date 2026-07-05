/**
 * Pruebas unitarias de interacción DOM para el diálogo de confirmación y las notificaciones.
 */
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { NotificationOutletComponent } from '@core/notifications/notification-outlet.component';
import { NotificationService } from '@core/notifications/notification.service';

describe('dialog and notification components', () => {
  // Caso: closes the confirmation dialog with true or false.
  it('closes the confirmation dialog with true or false', async () => {
    const ref = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Delete?',
            message: 'This cannot be undone',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
          },
        },
        { provide: DialogRef, useValue: ref },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[0].click();
    buttons[1].click();

    expect(ref.close).toHaveBeenNthCalledWith(1, false);
    expect(ref.close).toHaveBeenNthCalledWith(2, true);
  });

  // Caso: renders and dismisses application notifications.
  it('renders and dismisses application notifications', async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [NotificationOutletComponent],
      providers: [NotificationService],
    }).compileComponents();
    const service = TestBed.inject(NotificationService);
    const fixture = TestBed.createComponent(NotificationOutletComponent);
    service.show('error', 'Operation failed', 'Error');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operation failed');
    expect(fixture.nativeElement.querySelector('.alert-danger')).not.toBeNull();
    (fixture.nativeElement.querySelector('.btn-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert')).toBeNull();
    vi.useRealTimers();
  });
});
