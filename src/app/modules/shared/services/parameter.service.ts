import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { inject, Injectable, Type } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(DialogService);

  openDialog<T, D>(component: Type<T>, data?: D, computer?: string, mobile?: string): DynamicDialogRef {
    return this.dialog.open(component, {
      width: computer && mobile ? this.getModalWidthByParameters(computer, mobile) : this.getModalWidth,
      contentStyle: { padding: '0' },
      baseZIndex: 10000,
      showHeader: false,
      data: data
    });
  }

  imageFileValidator(control: AbstractControl): ValidationErrors | null {
    const file: File = control.value;
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
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
