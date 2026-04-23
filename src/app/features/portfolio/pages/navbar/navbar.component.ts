import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { MenuItem } from 'primeng/api';
import { Profile } from '@shared/models/profile';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  protected translate = inject(TranslateService);

  @Output() contact = new EventEmitter<number>();

  @Input() navItems: MenuItem[] = [];
  @Input() profile!: Profile;

  navbarExpanded = false;

  languages = [
    { code: 'Es', language: 'Español' },
    { code: 'En', language: 'English' }
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
