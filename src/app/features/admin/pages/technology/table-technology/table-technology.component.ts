import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmTechnologyComponent } from '@features/admin/pages/technology/frm-technology/frm-technology.component';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { TechnologyService } from '@features/admin/services/technology.service';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Technology } from '@shared/interfaces/technology';

@Component({
  selector: 'app-table-technology',
  templateUrl: './table-technology.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableTechnologyComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly technologyService = inject(TechnologyService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Technology>({
    destroyRef: this.destroyRef,
    load: () => this.technologyService.getTechnologyList(),
    remove: (id) => this.technologyService.deleteTechnology(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.technology;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<Technology>[] = [{ name: 'Name', value: 'name' }];

  ngOnInit(): void {
    this.getTechnologyList();
  }

  getTechnologyList(): void {
    this.state.load();
  }

  modalTechnology(technology?: Technology): void {
    this.dialogs
      .open(FrmTechnologyComponent, { data: { technology } })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getTechnologyList());
  }

  confirmDelete(technology: Technology): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteTechnology(technology));
  }

  deleteTechnology(technology: Technology): void {
    this.state.remove(technology.id);
  }
}
