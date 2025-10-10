import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  @Input() navItems: MenuItem[] = [];
  @Input() lastName = '';
  @Input() title = '';
  @Input() name = '';

  closeNavbar(): void {
    const navbarBtn = document.getElementById('navbarBtn');
    if (navbarBtn) navbarBtn.click();
  }

}
