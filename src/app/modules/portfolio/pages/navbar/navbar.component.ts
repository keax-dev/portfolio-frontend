import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateService } from '@app/home/services/translate.service';
import { MenuItem } from 'primeng/api';
import { Profile } from '@app/home/interfaces/profile';

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

  languages = [{ code: 'En', language: 'English' }, { code: 'Es', language: 'Español' }];

  closeNavbar(): void {
    const navbarBtn = document.getElementById('navbarBtn');
    if (navbarBtn) navbarBtn.click();
  }

  contactEmit(): void {
    this.closeNavbar();
    this.contact.emit();
  }

}
