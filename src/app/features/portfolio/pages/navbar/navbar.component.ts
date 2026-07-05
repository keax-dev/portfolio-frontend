import { Component, inject, output, input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { TranslateService } from '@core/services/translate.service';
import { LanguagePipe } from '@features/portfolio/pipe/language.pipe';
import { Profile } from '@shared/interfaces/profile';
import { NavigationItem } from '@shared/interfaces/navigation-item';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, LanguagePipe],
})
export class NavbarComponent {
  protected translate = inject(TranslateService);

  readonly contact = output<void>();

  readonly navItems = input<readonly NavigationItem[]>([]);
  readonly profile = input.required<Profile>();

  navbarExpanded = false;

  languages = [
    { code: 'Es', language: 'Español' },
    { code: 'En', language: 'English' },
  ];

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
