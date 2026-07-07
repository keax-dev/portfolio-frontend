import { FrmEducationComponent } from '@features/admin/pages/education/frm-education/frm-education.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { EducationService } from '@features/admin/services/education.service';
import { TableComponent } from '@shared/components/table/table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/interfaces/education';
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
  inject,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-table-education',
  templateUrl: './table-education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableEducationComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private educationService = inject(EducationService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly pageCopy = adminTableCopy.education;
  readonly records = signal<readonly Education[]>([]);
  readonly isLoading = signal(false);
  readonly loadErrorMessage = signal('');

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Title', value: 'title' },
    { name: 'Institution', value: 'institution_name' },
    { name: 'Picture', value: 'institution_url', image: true },
    { name: 'Place', value: 'place' },
    { name: 'Start', value: 'start' },
    { name: 'End', value: 'end' },
  ];

  ngOnInit(): void {
    this.getEducationList();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getEducationList(): void {
    this.isLoading.set(true);
    this.loadErrorMessage.set('');
    this.educationService
      .getEducationList()
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

  modalEducation(education?: Education): void {
    const dialogRef = this.parameter.openDialog(FrmEducationComponent, {
      positions: this.records().length + 5,
      education: education,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            this.getEducationList();
          }
        },
      });
  }

  confirmDelete(education: Education): void {
    this.alert.confirmDelete(() => this.deleteEducation(education));
  }

  deleteEducation(education: Education): void {
    this.spinner.show();
    this.educationService
      .deleteEducation(education.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getEducationList();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
