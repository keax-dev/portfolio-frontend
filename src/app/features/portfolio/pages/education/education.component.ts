import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CardEducationComponent } from '@features/portfolio/pages/education/card-education/card-education.component';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Education } from '@shared/interfaces/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardEducationComponent, LanguagePipe],
})
export class EducationComponent {
  protected readonly translate = inject(TranslateService);

  readonly educationList = input<readonly Education[]>([]);

  title = { label: 'Education', label_es: 'Educación' };
}
