import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmInstitutionComponent } from '@features/admin/pages/institution/frm-institution/frm-institution.component';
import { InstitutionService } from '@features/admin/services/institution.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Institution } from '@shared/interfaces/institution';

@Component({
  selector: 'app-table-institution',
  templateUrl: './table-institution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableInstitutionComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly institutionService = inject(InstitutionService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Institution>({
    destroyRef: this.destroyRef,
    load: () => this.institutionService.getInstitutionList(),
    remove: (id) => this.institutionService.deleteInstitution(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.institution;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<Institution>[] = [
    { name: 'Institution', value: 'name' },
    { name: 'Picture', value: 'url', image: true, imageAlt: (record) => record.name },
  ];

  ngOnInit(): void {
    this.getInstitutionList();
  }

  getInstitutionList(): void {
    this.state.load();
  }

  modalInstitution(institution?: Institution): void {
    this.dialogs
      .open(FrmInstitutionComponent, { data: institution })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getInstitutionList());
  }

  confirmDelete(institution: Institution): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteInstitution(institution));
  }

  deleteInstitution(institution: Institution): void {
    this.state.remove(institution.id);
  }
}
