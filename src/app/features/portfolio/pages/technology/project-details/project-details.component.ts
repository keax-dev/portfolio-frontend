import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectImagesComponent } from '@features/portfolio/pages/technology/project-images/project-images.component';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Project, ProjectLink } from '@shared/interfaces/project';
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
    switch (link.type) {
      case 'DEPLOY':
        return this.translate.text(uiText.portfolio.project.visitSite);
      case 'GITHUB_FRONTEND':
        return this.translate.text(uiText.portfolio.project.frontendCode);
      case 'GITHUB_BACKEND':
        return this.translate.text(uiText.portfolio.project.backendCode);
      default:
        return this.translate.text(uiText.portfolio.project.sourceCode);
    }
  }

  linkIcon(link: ProjectLink): string {
    return link.type === 'DEPLOY' ? 'pi pi-external-link' : 'pi pi-github';
  }

  projectLinkLabel(link: ProjectLink): string {
    const title = this.translate.getLang === 'es' ? this.project.title_es : this.project.title;
    return `${this.linkLabel(link)} ${this.translate.text(uiText.portfolio.project.linkFor)} ${title}`;
  }
}
