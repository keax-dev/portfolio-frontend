import { FrmTechnologyComponent } from '@features/admin/pages/technology/frm-technology/frm-technology.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { finalize } from 'rxjs';
import { Column } from '@shared/components/interfaces/column';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-table-technology',
  templateUrl: './table-technology.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableTechnologyComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private technologyService = inject(TechnologyService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly pageCopy = adminTableCopy.technology;
  readonly records = signal<readonly Technology[]>([]);
  readonly isLoading = signal(false);
  readonly loadErrorMessage = signal('');

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Name', value: 'name' },
  ];

  ngOnInit(): void {
    this.getTechnologyList();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getTechnologyList(): void {
    this.isLoading.set(true);
    this.loadErrorMessage.set('');
    this.technologyService
      .getTechnologyList()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.records.set(result.data);
          this.loadErrorMessage.set('');
        },
        error: (error) => {
          this.records.set([]);
          this.loadErrorMessage.set(ADMIN_TABLE_LOAD_ERROR_MESSAGE);
          this.alert.httpError(error);
        },
      });
  }

  modalTechnology(technology?: Technology): void {
    const dialogRef = this.parameter.openDialog(FrmTechnologyComponent, {
      positions: this.records().length + 5,
      technology: technology,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            this.getTechnologyList();
          }
        },
      });
  }

  confirmDelete(technology: Technology): void {
    this.alert.confirmDelete(() => this.deleteTechnology(technology));
  }

  deleteTechnology(technology: Technology): void {
    this.spinner.show();
    this.technologyService
      .deleteTechnology(technology.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getTechnologyList();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
