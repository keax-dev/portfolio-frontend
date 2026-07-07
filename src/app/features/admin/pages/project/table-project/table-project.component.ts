import { FrmProjectComponent } from '@features/admin/pages/project/frm-project/frm-project.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ProjectService } from '@features/admin/services/project.service';
import { TableComponent } from '@shared/components/table/table.component';
import { AlertService } from '@core/services/alert.service';
import { finalize } from 'rxjs';
import { Project } from '@shared/interfaces/project';
import { Column } from '@shared/components/interfaces/column';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnDestroy,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-table-project',
  templateUrl: './table-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
})
export class TableProjectComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private projectService = inject(ProjectService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  readonly records = signal<readonly Project[]>([]);
  readonly positionsInfo = computed(() =>
    this.records().reduce<Record<number, number>>((positions, project) => {
      positions[project.technology] = (positions[project.technology] ?? 0) + 1;
      return positions;
    }, {}),
  );

  columns: Column[] = [
    { name: 'Position', value: 'position' },
    { name: 'Technology', value: 'technology_name' },
    { name: 'Title', value: 'title' },
    { name: 'Description', value: 'description' },
    { name: 'Picture', value: 'picture', image: true },
    { name: 'Deploy', value: 'deploy' },
    { name: 'Github', value: 'github' },
  ];

  ngOnInit(): void {
    this.getProjectList();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getProjectList(): void {
    this.spinner.show();
    this.projectService
      .getProjectList()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.records.set(result.data);
        },
        error: (error) => {
          this.records.set([]);
          this.alert.httpError(error);
        },
      });
  }

  modalProject(project?: Project): void {
    const dialogRef = this.parameter.openDialog(FrmProjectComponent, {
      positionsInfo: this.positionsInfo(),
      project: project,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) this.getProjectList();
        },
      });
  }

  confirmDelete(project: Project): void {
    this.alert.confirmDelete(() => this.deleteProject(project));
  }

  deleteProject(project: Project): void {
    this.spinner.show();
    this.projectService
      .deleteProject(project.id!)
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.alert.success(result.alert);
          this.getProjectList();
        },
        error: (error) => this.alert.httpError(error),
      });
  }
}
