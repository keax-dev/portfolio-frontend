import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert.service';
import { ConfirmationService } from '@core/services/confirmation.service';
import { DialogService } from '@core/services/dialog.service';
import {
  ADMIN_TABLE_LOAD_ERROR_MESSAGE,
  adminTableCopy,
} from '@features/admin/config/admin-page-text';
import { FrmProjectComponent } from '@features/admin/pages/project/frm-project/frm-project.component';
import { ProjectService } from '@features/admin/services/project.service';
import { createAdminCrudListState } from '@features/admin/state/admin-crud-list.state';
import { Column } from '@shared/components/interfaces/column';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Project } from '@shared/interfaces/project';

interface ProjectTableRecord extends Project {
  readonly technology_names: string;
  readonly link_types: string;
  readonly image_count: number;
  readonly preview_image?: string;
}

@Component({
  selector: 'app-table-project',
  templateUrl: './table-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, PageHeaderComponent],
})
export class TableProjectComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectService = inject(ProjectService);
  private readonly dialogs = inject(DialogService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly alert = inject(AlertService);
  private readonly state = createAdminCrudListState<Project>({
    destroyRef: this.destroyRef,
    load: () => this.projectService.getProjectList(),
    remove: (id) => this.projectService.deleteProject(id),
    loadErrorMessage: ADMIN_TABLE_LOAD_ERROR_MESSAGE,
    onError: (error) => this.alert.httpError(error),
    onRemoved: (message) => this.alert.success(message),
  });

  readonly pageCopy = adminTableCopy.project;
  readonly records = this.state.records;
  readonly isLoading = this.state.isLoading;
  readonly loadErrorMessage = this.state.loadErrorMessage;
  readonly tableRecords = computed<readonly ProjectTableRecord[]>(() =>
    this.records().map((project) => ({
      ...project,
      technology_names: project.technologies.map((technology) => technology.name).join(', '),
      link_types: project.links.map((link) => link.type.replaceAll('_', ' ')).join(', '),
      image_count: project.images.length,
      preview_image: project.images[0]?.url,
    })),
  );
  readonly columns: readonly Column<ProjectTableRecord>[] = [
    { name: 'Position', value: 'position' },
    { name: 'Technologies', value: 'technology_names' },
    { name: 'Title', value: 'title' },
    { name: 'Description', value: 'description' },
    { name: 'Images', value: 'image_count' },
    { name: 'Preview', value: 'preview_image', image: true, imageAlt: (record) => record.title },
    { name: 'Links', value: 'link_types' },
  ];

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList(): void {
    this.state.load();
  }

  modalProject(project?: Project): void {
    this.dialogs
      .open(FrmProjectComponent, { data: { positions: this.records().length, project } })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => result && this.getProjectList());
  }

  confirmDelete(project: Project): void {
    this.confirmation
      .confirmDelete()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => confirmed && this.deleteProject(project));
  }

  deleteProject(project: Project): void {
    this.state.remove(project.id);
  }
}
