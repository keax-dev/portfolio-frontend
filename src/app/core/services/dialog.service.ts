import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface ResponsiveDialogConfig<D> {
  readonly data?: D;
  readonly desktopWidth?: string;
  readonly mobileWidth?: string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);

  open<T, D = undefined, R = unknown>(
    component: Type<T>,
    config: ResponsiveDialogConfig<D> = {},
  ): MatDialogRef<T, R> {
    return this.dialog.open<T, D, R>(component, {
      width: this.resolveWidth(config),
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      data: config.data,
    });
  }

  private resolveWidth<D>(config: ResponsiveDialogConfig<D>): string {
    const isMobile = this.breakpointObserver.isMatched('(max-width: 500px)');
    if (config.desktopWidth && config.mobileWidth) {
      return isMobile ? config.mobileWidth : config.desktopWidth;
    }

    return isMobile ? '90%' : '45%';
  }
}
