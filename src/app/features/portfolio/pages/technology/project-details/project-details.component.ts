import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ShowImageComponent } from '@features/portfolio/pages/technology/show-image/show-image.component';
import { ParameterService } from '@core/services/parameter.service';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Project } from '@shared/interfaces/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguagePipe],
})
export class ProjectDetailsComponent implements OnInit {
  protected translate = inject(TranslateService);
  private parameter = inject(ParameterService);
  private readonly data = inject<Project>(DIALOG_DATA);
  private readonly ref = inject(DialogRef);

  project!: Project;

  ngOnInit(): void {
    this.project = this.data;
  }

  close(): void {
    this.ref.close();
  }

  showImage(): void {
    const info = { url: this.project.picture, alt: this.project.title };
    this.parameter.openDialog(ShowImageComponent, info, '95%', '97.5%');
  }
}
