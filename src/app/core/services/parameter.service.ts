import { AbstractControl, ValidationErrors } from '@angular/forms';
import { inject, Injectable, Type } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(Dialog);

  openDialog<T, D, R = unknown>(
    component: Type<T>,
    data?: D,
    computer?: string,
    mobile?: string,
  ): DialogRef<R, T> {
    return this.dialog.open<R, D, T>(component, {
      width:
        computer && mobile ? this.getModalWidthByParameters(computer, mobile) : this.getModalWidth,
      maxWidth: '100vw',
      data,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      panelClass: 'app-dialog-panel',
      backdropClass: 'app-dialog-backdrop',
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

  get getModalWidth(): string {
    return this.breakpointObserver.isMatched('(max-width: 500px)') ? '90%' : '45%';
  }

  getModalWidthByParameters(computer: string, mobile: string): string {
    return this.breakpointObserver.isMatched('(max-width: 500px)') ? mobile : computer;
  }
}
