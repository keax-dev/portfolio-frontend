import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  @Input() name = '';
  @Input() lastName = '';
  @Input() title = '';

  navItems: MenuItem[] = [
    { label: 'Home', routerLink: '#home' },
    { label: 'Education', routerLink: '#education' },
    { label: 'Skills', routerLink: '#skills' },
    { label: 'Portfolio', routerLink: '#portfolio' },
    { label: 'Contact', routerLink: '#contact' },
    { label: 'Login', routerLink: '/login' },
  ];

  closeNavbar(): void {
    const navbarBtn = document.getElementById('navbarBtn');
    if (navbarBtn) navbarBtn.click();
  }

}
