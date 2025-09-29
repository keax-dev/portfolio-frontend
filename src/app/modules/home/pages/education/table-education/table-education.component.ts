import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmEducationComponent } from '../frm-education/frm-education.component';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { EducationService } from '@app/home/services/education.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Education } from '@app/home/interfaces/education';
import { Column } from '@app/components/interfaces/column';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-education.component.html',
  styleUrls: ['./table-education.component.css'],
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
      next: result => {
        if (result.status) this.records = result.data;
        else this.records = [];
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
        if (result.status) {
          this.alert.success(result.alert);
          this.getEducationListByDeleted();
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }


}
