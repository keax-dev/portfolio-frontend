import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  @Output() contact = new EventEmitter<number>();

  @Input() navItems: MenuItem[] = [];
  @Input() lastName = '';
  @Input() title = '';
  @Input() name = '';

  closeNavbar(): void {
    const navbarBtn = document.getElementById('navbarBtn');
    if (navbarBtn) navbarBtn.click();
  }

  contactEmit(): void {
    this.closeNavbar();
    this.contact.emit();
  }

}
