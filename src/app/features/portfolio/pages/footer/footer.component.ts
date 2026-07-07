import { Component, inject, output, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { TitleCasePipe } from '@angular/common';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, LanguagePipe],
})
export class FooterComponent {
  protected readonly translate = inject(TranslateService);

  readonly text = uiText;
  readonly contact = output<void>();

  readonly socialNetworkList = input<readonly SocialNetwork[]>([]);
  readonly navItems = input<readonly NavigationItem[]>([]);

  year = new Date().getFullYear();

  socialNetworksMessage(): string {
    return this.translate.text(this.text.portfolio.socialNetworksMessage);
  }

  rightsReserved(): string {
    return this.translate.text(this.text.portfolio.rightsReserved);
  }

  socialMediaLabel(): string {
    return this.translate.text(this.text.portfolio.socialMediaLinks);
  }

  footerNavigationLabel(): string {
    return this.translate.text(this.text.portfolio.footerNavigation);
  }

  openSocialLabel(name: string): string {
    return `${this.translate.text(this.text.portfolio.openSocialPrefix)} ${name}`;
  }

  contactEmit(): void {
    this.contact.emit();
  }
}
