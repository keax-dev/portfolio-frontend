import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from '@core/services/confirmation.service';
import { firstValueFrom, of } from 'rxjs';

describe('ConfirmationService', () => {
  it.each([
    [true, true],
    [false, false],
    [undefined, false],
  ])('maps dialog result %s to %s', async (dialogResult, expected) => {
    const dialog = {
      open: vi.fn().mockReturnValue({ afterClosed: () => of(dialogResult) }),
    };
    TestBed.configureTestingModule({
      providers: [ConfirmationService, { provide: MatDialog, useValue: dialog }],
    });

    await expect(firstValueFrom(TestBed.inject(ConfirmationService).confirmDelete())).resolves.toBe(
      expected,
    );
    expect(dialog.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ data: expect.objectContaining({ confirmLabel: 'Confirm' }) }),
    );
  });
});
