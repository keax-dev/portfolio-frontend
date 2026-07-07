import { Component, inject, output, input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { TranslateService } from '@core/services/translate.service';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Profile } from '@shared/interfaces/profile';
import { uiText } from '@core/i18n/ui-text';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, LanguagePipe],
})
export class NavbarComponent {
  protected translate = inject(TranslateService);

  readonly text = uiText;
  readonly contact = output<void>();

  readonly navItems = input<readonly NavigationItem[]>([]);
  readonly profile = input.required<Profile>();

  navbarExpanded = false;

  languages = [
    { code: 'es', shortCode: 'ES', language: 'Español' },
    { code: 'en', shortCode: 'EN', language: 'English' },
  ];

  primaryNavigationLabel(): string {
    return this.translate.text(this.text.portfolio.primaryNavigation);
  }

  toggleNavigationLabel(): string {
    return this.translate.text(this.text.portfolio.toggleNavigation);
  }

  toggleNavbar(): void {
    this.navbarExpanded = !this.navbarExpanded;
  }

  closeNavbar(): void {
    this.navbarExpanded = false;
  }

  selectLanguage(code: string): void {
    this.translate.setLang = code.toLowerCase();
    this.closeNavbar();
  }

  contactEmit(): void {
    this.closeNavbar();
    this.contact.emit();
  }
}
