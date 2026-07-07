import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly message: string;
  readonly title: string;
}

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <mat-dialog-content>
      <h2 mat-dialog-title id="confirm-dialog-title">{{ data.title }}</h2>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="btn btn-dark px-4 m-1" type="button" (click)="dialogRef.close(false)">
        {{ data.cancelLabel }}
      </button>
      <button class="btn btn-danger px-4 m-1" type="button" (click)="dialogRef.close(true)">
        {{ data.confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  protected readonly dialogRef = inject<MatDialogRef<unknown, boolean>>(MatDialogRef);
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
