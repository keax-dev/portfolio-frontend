import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { Project } from '@app/home/interfaces/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  standalone: false
})
export class ProjectDetailsComponent implements OnInit {

  protected translate = inject(TranslateService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  project!: Project;

  ngOnInit(): void {
    this.project = this.config.data;
  }

  close(): void {
    this.ref.close();
  }

}
