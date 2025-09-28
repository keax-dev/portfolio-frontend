import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmTechnologyComponent } from '../frm-technology/frm-technology.component';
import { Subject, takeUntil } from 'rxjs';
import { TechnologyService } from '@app/home/services/technology.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Technology } from '@app/home/interfaces/technology';
import { Education } from '@app/home/interfaces/education';
import { Column } from '@app/components/interfaces/column';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-technology.component.html',
  styleUrls: ['./table-technology.component.css'],
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
      next: result => {
        if (result.status) this.records = result.data;
        else this.records = [];
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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

  confirmDelete(education: Education): void {
    this.alert.confirmDelete(() => this.deleteTechnology(education));
  }

  deleteTechnology(education: Education): void {
    this.spinner.show();
    this.technologyService.deleteTechnology(education.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.getTechnologyListByDeleted();
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }


}
