import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly message: string;
  readonly title: string;
}

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="confirm-dialog-title" class="bg-white rounded p-4 shadow">
      <h2 class="h5 text-danger" id="confirm-dialog-title">{{ data.title }}</h2>
      <p class="my-3">{{ data.message }}</p>
      <footer class="d-flex justify-content-end gap-2">
        <button class="btn btn-secondary" type="button" (click)="dialogRef.close(false)">
          {{ data.cancelLabel }}
        </button>
        <button class="btn btn-danger" type="button" (click)="dialogRef.close(true)">
          {{ data.confirmLabel }}
        </button>
      </footer>
    </section>
  `,
})
export class ConfirmDialogComponent {
  protected readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);
  protected readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
}
