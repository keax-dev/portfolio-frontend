import { FrmInstitutionComponent } from '@features/admin/pages/institution/frm-institution/frm-institution.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { TableComponent } from '@shared/components/table/table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AlertService } from '@core/services/alert.service';
import { Institution } from '@shared/interfaces/institution';
import { finalize } from 'rxjs';
import { Column } from '@shared/components/interfaces/column';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-table-institution',
  templateUrl: './table-institution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableInstitutionComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private institutionService = inject(InstitutionService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly pageCopy = adminTableCopy.institution;
  readonly records = signal<readonly Institution[]>([]);
  readonly isLoading = signal(false);
  readonly loadErrorMessage = signal('');

  columns: Column[] = [
    { name: 'Institution', value: 'name' },
    { name: 'Picture', value: 'url', image: true },
  ];

  ngOnInit(): void {
    this.getInstitutionList();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getInstitutionList(): void {
    this.isLoading.set(true);
    this.loadErrorMessage.set('');
    this.institutionService
      .getInstitutionList()
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

  modalInstitution(institution?: Institution): void {
    const dialogRef = this.parameter.openDialog(FrmInstitutionComponent, institution);
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            this.getInstitutionList();
          }
        },
      });
  }

  confirmDelete(institution: Institution): void {
    this.alert.confirmDelete(() => this.deleteInstitution(institution));
  }

  deleteInstitution(institution: Institution): void {
    this.spinner.show();
    this.institutionService
      .deleteInstitution(institution.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getInstitutionList();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
