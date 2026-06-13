import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { FrmInstitutionComponent } from '@features/admin/pages/institution/frm-institution/frm-institution.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { AlertService } from '@core/services/alert.service';
import { Institution } from '@shared/interfaces/institution';
import { Column } from '@shared/components/interfaces/column';

@Component({
    selector: 'app-table-institution',
    templateUrl: './table-institution.component.html',
    imports: [TableComponent]
})
export class TableInstitutionComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

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
    this.spinner.hide();
  }

  getInstitutionListByDeleted(): void {
    this.spinner.show();
    this.institutionService.getInstitutionListByDeleted().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => this.records = result.data,
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

  modalInstitution(institution?: Institution): void {
    const dialogRef = this.parameter.openDialog(FrmInstitutionComponent, institution);
    dialogRef.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.institutionService.deleteInstitution(institution.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getInstitutionListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
