import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectDetailsComponent } from '@features/portfolio/pages/project/project-details/project-details.component';
import { ProjectImagesComponent } from '@features/portfolio/pages/project/project-images/project-images.component';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { DialogService } from '@core/services/dialog.service';
import { TranslateService } from '@core/services/translate.service';
import { Project, ProjectLink } from '@shared/interfaces/project';
import { PROJECT_LINK_META } from '@shared/config/project-link-meta';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-project-gallery',
  templateUrl: './project-gallery.component.html',
  styleUrl: './project-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LanguagePipe, ProjectImagesComponent],
})
export class ProjectGalleryComponent {
  protected readonly translate = inject(TranslateService);
  private readonly dialogs = inject(DialogService);

  readonly projectList = input<readonly Project[]>([]);
  readonly text = uiText;

  showProjectDetails(project: Project): void {
    this.dialogs.open(ProjectDetailsComponent, {
      data: project,
      desktopWidth: '70%',
      mobileWidth: '95%',
    });
  }

  linkLabel(link: ProjectLink): string {
    return this.translate.text(PROJECT_LINK_META[link.type].label);
  }

  linkIcon(link: ProjectLink): string {
    return PROJECT_LINK_META[link.type].icon;
  }

  projectLinkLabel(link: ProjectLink, project: Project): string {
    return `${this.linkLabel(link)} ${this.translate.text(uiText.portfolio.project.linkFor)} ${this.projectTitle(project)}`;
  }

  projectTitle(project: Project): string {
    return this.translate.getLang === 'es' ? project.title_es : project.title;
  }
}
