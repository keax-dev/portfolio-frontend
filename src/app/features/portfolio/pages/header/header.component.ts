import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Profile } from '@shared/interfaces/profile';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [TitleCasePipe, LanguagePipe]
})
export class HeaderComponent {

  protected readonly translate = inject(TranslateService);

  readonly profile = input.required<Profile>();

  cv = { label: 'View CV', label_es: 'Visualizar CV' }

  get classTitle() {
    switch (this.translate.getLang) {
      case 'en':
        return 'machine-2';
      case 'es':
        return 'machine-2-es';
      default:
        return '';
    }
  }

}
