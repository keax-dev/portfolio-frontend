import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CardEducationComponent } from '@features/portfolio/pages/education/card-education/card-education.component';
import { TranslateService } from '@core/services/translate.service';
import { Education } from '@shared/interfaces/education';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardEducationComponent],
})
export class EducationComponent {
  protected readonly translate = inject(TranslateService);

  readonly text = uiText;
  readonly educationList = input<readonly Education[]>([]);

  titleLabel(): string {
    return this.translate.text(this.text.portfolio.sections.education);
  }

  emptyMessage(): string {
    return this.translate.text(this.text.portfolio.emptyRecords);
  }
}
