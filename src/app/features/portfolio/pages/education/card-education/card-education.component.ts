import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { Education } from '@shared/models/education';
import { NgClass, TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '../../../pipe/language.pipe';

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
