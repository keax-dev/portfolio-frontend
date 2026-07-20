import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectGalleryComponent } from '@features/portfolio/pages/project/project-gallery/project-gallery.component';
import { TranslateService } from '@core/services/translate.service';
import { Project } from '@shared/interfaces/project';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-project',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project.component.html',
  imports: [ProjectGalleryComponent],
})
export class ProjectComponent {
  protected readonly translate = inject(TranslateService);

  readonly text = uiText;
  readonly projectList = input<readonly Project[]>([]);

  titleLabel(): string {
    return this.translate.text(this.text.portfolio.sections.portfolio);
  }

  emptyMessage(): string {
    return this.translate.text(this.text.portfolio.emptyRecords);
  }
}
