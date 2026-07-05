import { FrmEducationComponent } from '@features/admin/pages/education/frm-education/frm-education.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { EducationService } from '@features/admin/services/education.service';
import { TableComponent } from '@shared/components/table/table.component';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/interfaces/education';
import { Column } from '@shared/components/interfaces/column';
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
  imports: [TableComponent],
})
export class TableEducationComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private educationService = inject(EducationService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly records = signal<readonly Education[]>([]);

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
    this.getEducationListByDeleted();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getEducationListByDeleted(): void {
    this.spinner.show();
    this.educationService
      .getEducationListByDeleted()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.records.set(result.data),
        complete: () => this.spinner.hide(),
        error: (error) => {
          this.records.set([]);
          this.alert.httpError(error);
        },
      });
  }

  modalEducation(education?: Education): void {
    const dialogRef = this.parameter.openDialog(FrmEducationComponent, {
      positions: this.records().length + 5,
      education: education,
    });
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) this.getEducationListByDeleted();
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getEducationListByDeleted();
        },
        complete: () => this.spinner.hide(),
        error: (error) => this.alert.httpError(error),
      });
  }
}
