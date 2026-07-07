import { FrmTechnologyComponent } from '@features/admin/pages/technology/frm-technology/frm-technology.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/interfaces/technology';
import { Column } from '@shared/components/interfaces/column';
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
  selector: 'app-table-education',
  templateUrl: './table-technology.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
})
export class TableTechnologyComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private technologyService = inject(TechnologyService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly records = signal<readonly Technology[]>([]);

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Name', value: 'name' },
  ];

  ngOnInit(): void {
    this.getTechnologyListByDeleted();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getTechnologyListByDeleted(): void {
    this.spinner.show();
    this.technologyService
      .getTechnologyListByDeleted()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.records.set(result.data),
        complete: () => this.spinner.hide(),
        error: (error) => {
          this.records.set([]);
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
          if (result) this.getTechnologyListByDeleted();
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getTechnologyListByDeleted();
        },
        complete: () => this.spinner.hide(),
        error: (error) => this.alert.httpError(error),
      });
  }
}
