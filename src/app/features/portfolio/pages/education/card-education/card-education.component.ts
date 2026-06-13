import { Component, inject, input } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Education } from '@shared/interfaces/education';

@Component({
    selector: 'app-card-education',
    templateUrl: './card-education.component.html',
    styleUrls: ['./card-education.component.css'],
    imports: [NgClass, TitleCasePipe, LanguagePipe]
})
export class CardEducationComponent {

  readonly translate = inject(TranslateService);

  readonly education = input.required<Education>();
  readonly position = input.required<boolean>();

}
