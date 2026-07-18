import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectDetailsComponent } from '@features/portfolio/pages/technology/project-details/project-details.component';
import { ShowImageComponent } from '@features/portfolio/pages/technology/show-image/show-image.component';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { ParameterService } from '@core/services/parameter.service';
import { TranslateService } from '@core/services/translate.service';
import { Project, ProjectLink } from '@shared/interfaces/project';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrl: './project-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguagePipe],
})
export class ProjectGalleryComponent {
  protected readonly translate = inject(TranslateService);
  private readonly parameter = inject(ParameterService);

  readonly projectList = input<readonly Project[]>([]);
  readonly text = uiText;

  showProjectDetails(project: Project): void {
    this.parameter.openDialog(ProjectDetailsComponent, project, '70%', '95%');
  }

  showImage(project: Project): void {
    this.parameter.openDialog(
      ShowImageComponent,
      { url: project.picture, alt: this.projectTitle(project) },
      '95%',
      '97.5%',
    );
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

  projectLinkLabel(link: ProjectLink, project: Project): string {
    return `${this.linkLabel(link)} ${this.translate.text(uiText.portfolio.project.linkFor)} ${this.projectTitle(project)}`;
  }

  projectImageLabel(project: Project): string {
    return `${this.translate.text(uiText.portfolio.project.openImage)} ${this.projectTitle(project)}`;
  }

  projectTitle(project: Project): string {
    return this.translate.getLang === 'es' ? project.title_es : project.title;
  }
}
