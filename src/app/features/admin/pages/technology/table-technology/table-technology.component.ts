import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmTechnologyComponent } from '../frm-technology/frm-technology.component';
import { Subject, takeUntil } from 'rxjs';
import { TechnologyService } from '@features/admin/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { AlertService } from '@core/services/alert.service';
import { Technology } from '@shared/models/technology';
import { Column } from '@shared/components/interfaces/column';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-technology.component.html',
  standalone: false
})
export class TableTechnologyComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private technologyService = inject(TechnologyService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  records: Technology[] = [];

  columns: Column[] = [
    { name: "Position", value: "position" },
    { name: "Name", value: "name" }
  ];

  ngOnInit(): void {
    this.getTechnologyListByDeleted();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getTechnologyListByDeleted(): void {
    this.spinner.show();
    this.technologyService.getTechnologyListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.alert.httpError(error);
      }
    });
  }

  modalTechnology(technology?: Technology): void {
    const dialogRef = this.parameter.openDialog(FrmTechnologyComponent, {
      positions: this.records.length + 5,
      technology: technology
    });
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getTechnologyListByDeleted();
      }
    });
  }

  confirmDelete(technology: Technology): void {
    this.alert.confirmDelete(() => this.deleteTechnology(technology));
  }

  deleteTechnology(technology: Technology): void {
    this.spinner.show();
    this.technologyService.deleteTechnology(technology.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getTechnologyListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
