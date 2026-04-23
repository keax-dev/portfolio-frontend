import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmInstitutionComponent } from '@features/admin/pages/institution/frm-institution/frm-institution.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { AlertService } from '@core/services/alert.service';
import { Institution } from '@shared/models/institution';
import { Column } from '@shared/components/interfaces/column';

@Component({
  selector: 'app-table-institution',
  templateUrl: './table-institution.component.html',
  standalone: false
})
export class TableInstitutionComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private institutionService = inject(InstitutionService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  records: Institution[] = [];

  columns: Column[] = [
    { name: "Institution", value: "name" },
    { name: "Picture", value: "url", image: true }
  ];

  ngOnInit(): void {
    this.getInstitutionListByDeleted();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getInstitutionListByDeleted(): void {
    this.spinner.show();
    this.institutionService.getInstitutionListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.alert.httpError(error);
      }
    });
  }

  modalInstitution(institution?: Institution): void {
    const dialogRef = this.parameter.openDialog(FrmInstitutionComponent, institution);
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getInstitutionListByDeleted();
      }
    });
  }

  confirmDelete(institution: Institution): void {
    this.alert.confirmDelete(() => this.deleteInstitution(institution));
  }

  deleteInstitution(institution: Institution): void {
    this.spinner.show();
    this.institutionService.deleteInstitution(institution.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getInstitutionListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
