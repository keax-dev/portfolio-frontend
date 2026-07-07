import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectCarouselComponent } from '@features/portfolio/pages/technology/project-carousel/project-carousel.component';
import { TranslateService } from '@core/services/translate.service';
import { TitleCasePipe } from '@angular/common';
import { Technology } from '@shared/interfaces/technology';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-technology',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './technology.component.html',
  imports: [ProjectCarouselComponent, TitleCasePipe],
})
export class TechnologyComponent {
  protected readonly translate = inject(TranslateService);

  readonly text = uiText;
  readonly technologyList = input<readonly Technology[]>([]);

  titleLabel(): string {
    return this.translate.text(this.text.portfolio.sections.portfolio);
  }

  emptyMessage(): string {
    return this.translate.text(this.text.portfolio.emptyRecords);
  }
}
