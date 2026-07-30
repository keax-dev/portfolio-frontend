import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmCourseComponent } from '@features/admin/pages/course/frm-course/frm-course.component';
import { CourseService } from '@features/admin/services/course.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Course } from '@shared/interfaces/course';

@Component({
  selector: 'app-table-course',
  templateUrl: './table-course.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableCourseComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly courseService = inject(CourseService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Course>({
    destroyRef: this.destroyRef,
    load: () => this.courseService.getCourseList(),
    remove: (id) => this.courseService.deleteCourse(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.course;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly columns: readonly Column<Course>[] = [
    { name: 'Position', value: 'position' },
    { name: 'Course (Spanish)', value: 'name' },
    { name: 'Course (English)', value: 'name_en' },
    { name: 'Institution', value: 'institution_name' },
    {
      name: 'Certificate image',
      value: 'certificate_img',
      image: true,
      imageAlt: (record) => `Certificate for ${record.name}`,
    },
    { name: 'Public certificate URL', value: 'certificate_url' },
  ];

  ngOnInit(): void {
    this.getCourseList();
  }

  getCourseList(): void {
    this.state.load();
  }

  modalCourse(course?: Course): void {
    this.dialogs
      .open(FrmCourseComponent, {
        data: { course, nextPosition: this.nextPosition() },
        desktopWidth: '55%',
        mobileWidth: '95%',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getCourseList());
  }

  confirmDelete(course: Course): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteCourse(course));
  }

  deleteCourse(course: Course): void {
    this.state.remove(course.id);
  }

  private nextPosition(): number {
    return Math.max(0, ...this.records().map((course) => course.position)) + 1;
  }
}
