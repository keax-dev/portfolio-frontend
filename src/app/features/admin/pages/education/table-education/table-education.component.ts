import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_POSITION_BUFFER,
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmEducationComponent } from '@features/admin/pages/education/frm-education/frm-education.component';
import { EducationService } from '@features/admin/services/education.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Education } from '@shared/interfaces/education';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableEducationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly educationService = inject(EducationService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Education>({
    destroyRef: this.destroyRef,
    load: () => this.educationService.getEducationList(),
    remove: (id) => this.educationService.deleteEducation(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.education;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<Education>[] = [
    { name: 'Position', value: 'position' },
    { name: 'Title', value: 'title' },
    { name: 'Institution', value: 'institution_name' },
    {
      name: 'Picture',
      value: 'institution_url',
      image: true,
      imageAlt: (record) => record.institution_name,
    },
    { name: 'Place', value: 'place' },
    { name: 'Start', value: 'start' },
    { name: 'End', value: 'end' },
  ];

  ngOnInit(): void {
    this.getEducationList();
  }

  getEducationList(): void {
    this.state.load();
  }

  modalEducation(education?: Education): void {
    this.dialogs
      .open(FrmEducationComponent, {
        data: { positions: this.records().length + ADMIN_POSITION_BUFFER, education },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getEducationList());
  }

  confirmDelete(education: Education): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteEducation(education));
  }

  deleteEducation(education: Education): void {
    this.state.remove(education.id);
  }
}
