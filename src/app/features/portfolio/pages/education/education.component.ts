import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Education } from '@shared/models/education';
import { CardEducationComponent } from './card-education/card-education.component';
import { LanguagePipe } from '../../pipe/language.pipe';

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    imports: [CardEducationComponent, LanguagePipe]
})
export class EducationComponent {

  protected readonly translate = inject(TranslateService);

  readonly educationList = input<Education[]>([]);

  title = { label: 'Education', label_es: 'Educación' }

}
