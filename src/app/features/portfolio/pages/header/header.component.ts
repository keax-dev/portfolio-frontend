import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CvPreviewComponent } from '@features/portfolio/pages/header/cv-preview/cv-preview.component';
import { TranslateService } from '@core/services/translate.service';
import { ParameterService } from '@core/services/parameter.service';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { uiText } from '@core/i18n/ui-text';
import { Profile } from '@shared/interfaces/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, LanguagePipe],
})
export class HeaderComponent {
  protected readonly translate = inject(TranslateService);
  private readonly parameter = inject(ParameterService);

  readonly text = uiText;
  readonly profile = input.required<Profile>();

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

  cvLabel(): string {
    return this.translate.text(this.text.portfolio.viewCv);
  }

  profilePhotoAlt(): string {
    return `${this.translate.text(this.text.portfolio.profilePhotoAltPrefix)} ${this.profile().name}`;
  }

  cvUrl(): string {
    const profile = this.profile();
    return this.translate.getLang === 'es'
      ? profile.cv_es || profile.cv
      : profile.cv || profile.cv_es;
  }

  openCvPreview(): void {
    const url = this.cvUrl();
    if (!url) {
      return;
    }

    this.parameter.openDialog(CvPreviewComponent, { url }, '92%', '98%');
  }
}
