import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnInit } from '@angular/core';
import { ShowImageComponent } from '@features/portfolio/pages/technology/show-image/show-image.component';
import { ParameterService } from '@core/services/parameter.service';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Project } from '@shared/interfaces/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  imports: [LanguagePipe]
})
export class ProjectDetailsComponent implements OnInit {

  protected translate = inject(TranslateService);
  private parameter = inject(ParameterService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  project!: Project;

  ngOnInit(): void {
    this.project = this.config.data;
  }

  close(): void {
    this.ref.close();
  }

  showImage(): void {
    const info = { url: this.project.picture, alt: this.project.title };
    this.parameter.openDialog(ShowImageComponent, info, '95%', '97.5%');
  }

}
