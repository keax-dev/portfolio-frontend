import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { ParameterService } from '@core/services/parameter.service';
import { TitleCasePipe } from '@angular/common';
import { CvPreviewComponent } from '@features/portfolio/pages/header/cv-preview/cv-preview.component';
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
  private readonly parameter = inject(ParameterService);

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

  openCvPreview(): void {
    if (!this.profile().cv) {
      return;
    }

    this.parameter.openDialog(CvPreviewComponent, { url: this.profile().cv }, '92%', '98%');
  }

}
