import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ProjectCarouselComponent } from '@features/portfolio/pages/technology/project-carousel/project-carousel.component';
import { TranslateService } from '@core/services/translate.service';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Technology } from '@shared/interfaces/technology';

@Component({
  selector: 'app-technology',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './technology.component.html',
  imports: [ProjectCarouselComponent, TitleCasePipe, LanguagePipe],
})
export class TechnologyComponent {
  protected readonly translate = inject(TranslateService);

  readonly technologyList = input<readonly Technology[]>([]);

  readonly title = { label: 'Portfolio', label_es: 'Portafolio' };
}
