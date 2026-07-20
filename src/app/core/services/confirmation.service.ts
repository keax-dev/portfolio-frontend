import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '@core/dialog/confirm-dialog.component';
import { map, Observable, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly dialog = inject(MatDialog);

  confirmDelete(): Observable<boolean> {
    const data: ConfirmDialogData = {
      title: 'Are you sure?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
    };

    return this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data,
        width: 'min(90vw, 28rem)',
      })
      .afterClosed()
      .pipe(
        take(1),
        map((confirmed) => confirmed === true),
      );
  }
}
