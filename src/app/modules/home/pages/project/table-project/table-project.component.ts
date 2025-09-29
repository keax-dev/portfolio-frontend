import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrmProjectComponent } from '../frm-project/frm-project.component';
import { Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterService } from '@app/shared/services/parameter.service';
import { ProjectService } from '@app/home/services/project.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Institution } from '@app/home/interfaces/institution';
import { Column } from '@app/components/interfaces/column';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-table-project',
  templateUrl: './table-project.component.html',
  styleUrls: ['./table-project.component.css'],
  standalone: false
})
export class TableProjectComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getProjectListByDeleted(): void {
    this.spinner.show();
    this.projectService.getProjectListByDeleted().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.records = result.data;
          this.positionsInfo = this.records.reduce((acc, project) => {
            const techName = project.technology;
            acc[techName] = (acc[techName] || 0) + 1;
            return acc;
          }, {} as Record<number, number>);
        } else {
          this.records = [];
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  modalProject(project?: Project): void {
    const dialogRef = this.parameter.openDialog(FrmProjectComponent, {
      positionsInfo: this.positionsInfo,
      project: project
    });
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result) this.getProjectListByDeleted();
      }
    });
  }

  confirmDelete(institution: Institution): void {
    this.alert.confirmDelete(() => this.deleteProject(institution));
  }

  deleteProject(institution: Institution): void {
    this.spinner.show();
    this.projectService.deleteProject(institution.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (result.status) {
          this.alert.success(result.alert);
          this.getProjectListByDeleted();
        } else {
          this.alert.resultWarnings(result);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

}
