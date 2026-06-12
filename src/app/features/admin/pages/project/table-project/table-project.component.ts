import { Component, inject, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FrmProjectComponent } from '../frm-project/frm-project.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@core/services/parameter.service';
import { ProjectService } from '@features/admin/services/project.service';
import { AlertService } from '@core/services/alert.service';
import { Column } from '@shared/components/interfaces/column';
import { Project } from '@shared/models/project';
import { TableComponent } from '../../../../../shared/components/table/table.component';

@Component({
    selector: 'app-table-project',
    templateUrl: './table-project.component.html',
    imports: [TableComponent]
})
export class TableProjectComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);

  private projectService = inject(ProjectService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  positionsInfo!: Record<number, number>;
  records: Project[] = [];

  columns: Column[] = [
    { name: "Position", value: "position" },
    { name: "Technology", value: "technology_name" },
    { name: "Title", value: "title" },
    { name: "Description", value: "description" },
    { name: "Picture", value: "picture", image: true },
    { name: "Deploy", value: "deploy" },
    { name: "Github", value: "github" }
  ];

  ngOnInit(): void {
    this.getProjectListByDeleted();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getProjectListByDeleted(): void {
    this.spinner.show();
    this.projectService.getProjectListByDeleted().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.records = result.data;
        this.positionsInfo = this.records.reduce((acc, project) => {
          const techName = project.technology;
          acc[techName] = (acc[techName] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
      },
      complete: () => this.spinner.hide(),
      error: error => {
        this.records = [];
        this.positionsInfo = {};
        this.alert.httpError(error);
      }
    });
  }

  modalProject(project?: Project): void {
    const dialogRef = this.parameter.openDialog(FrmProjectComponent, {
      positionsInfo: this.positionsInfo,
      project: project
    });
    dialogRef.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        if (result) this.getProjectListByDeleted();
      }
    });
  }

  confirmDelete(project: Project): void {
    this.alert.confirmDelete(() => this.deleteProject(project));
  }

  deleteProject(project: Project): void {
    this.spinner.show();
    this.projectService.deleteProject(project.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.alert.success(result.alert);
        this.getProjectListByDeleted();
      },
      complete: () => this.spinner.hide(),
      error: error => this.alert.httpError(error)
    });
  }

}
