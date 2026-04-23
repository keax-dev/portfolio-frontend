import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmEducationComponent } from '../frm-education/frm-education.component';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { EducationService } from '@features/admin/services/education.service';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/models/education';
import { Column } from '@shared/components/interfaces/column';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-education.component.html',
  standalone: false
})
export class TableEducationComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private educationService = inject(EducationService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  records: Education[] = [];

  columns: Column[] = [
    { name: "Position", value: "position" },
    { name: "Title", value: "title" },
    { name: "Institution", value: "institution_name" },
    { name: "Picture", value: "institution_url", image: true },
    { name: "Place", value: "place" },
    { name: "Start", value: "start" },
    { name: "End", value: "end" }
  ];

  ngOnInit(): void {
    this.getEducationListByDeleted();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getEducationListByDeleted(): void {
    this.spinner.show();
    this.educationService.getEducationListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.alert.httpError(error);
      }
    });
  }

  modalEducation(education?: Education): void {
    const dialogRef = this.parameter.openDialog(FrmEducationComponent, {
      positions: this.records.length + 5,
      education: education
    });
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getEducationListByDeleted();
      }
    });
  }

  confirmDelete(education: Education): void {
    this.alert.confirmDelete(() => this.deleteEducation(education));
  }

  deleteEducation(education: Education): void {
    this.spinner.show();
    this.educationService.deleteEducation(education.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getEducationListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }


}
