import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmInstitutionComponent } from '@app/home/pages/institution/frm-institution/frm-institution.component';
import { InstitutionService } from '@app/home/services/institution.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Institution } from '@app/home/interfaces/institution';
import { Column } from '@app/components/interfaces/column';

@Component({
  selector: 'app-table-institution',
  templateUrl: './table-institution.component.html',
  styleUrls: ['./table-institution.component.css'],
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
      next: result => {
        if (result.status) this.records = result.data;
        else this.records = [];
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
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
        if (result.status) {
          this.alert.success(result.alert);
          this.getInstitutionListByDeleted();
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

}
