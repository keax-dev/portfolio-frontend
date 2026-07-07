import { AbstractControl, ValidationErrors } from '@angular/forms';
import { inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);

  openDialog<T, D, R = unknown>(
    component: Type<T>,
    data?: D,
    computer?: string,
    mobile?: string,
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(component, {
      width: this.getModalWidthByParameters(computer, mobile),
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      data,
    });
  }

  imageFileValidator(control: AbstractControl<unknown>): ValidationErrors | null {
    const file = control.value;
    if (file instanceof File) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      return allowedTypes.includes(file.type) ? null : { invalidFileType: true };
    }
    return null;
  }

  getModalWidthByParameters(computer?: string, mobile?: string): string {
    if (!computer || !mobile) return this.getModalWidth;

    return this.breakpointObserver.isMatched('(max-width: 500px)') ? mobile : computer;
  }

  get getModalWidth(): string {
    return this.breakpointObserver.isMatched('(max-width: 500px)') ? '90%' : '45%';
  }
}
