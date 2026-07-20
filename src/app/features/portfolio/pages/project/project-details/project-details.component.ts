import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectImagesComponent } from '@features/portfolio/pages/project/project-images/project-images.component';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Project, ProjectLink } from '@shared/interfaces/project';
import { PROJECT_LINK_META } from '@shared/config/project-link-meta';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguagePipe, ProjectImagesComponent],
})
export class ProjectDetailsComponent implements OnInit {
  protected translate = inject(TranslateService);
  private readonly data = inject<Project>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<unknown>>(MatDialogRef);

  project!: Project;
  readonly text = uiText;

  ngOnInit(): void {
    this.project = this.data;
  }

  close(): void {
    this.ref.close();
  }

  linkLabel(link: ProjectLink): string {
    return this.translate.text(PROJECT_LINK_META[link.type].label);
  }

  linkIcon(link: ProjectLink): string {
    return PROJECT_LINK_META[link.type].icon;
  }

  projectLinkLabel(link: ProjectLink): string {
    const title = this.translate.getLang === 'es' ? this.project.title_es : this.project.title;
    return `${this.linkLabel(link)} ${this.translate.text(uiText.portfolio.project.linkFor)} ${title}`;
  }
}
