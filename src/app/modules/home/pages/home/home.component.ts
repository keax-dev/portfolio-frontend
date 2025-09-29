import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {

  menuList: MenuItem[] = [
    { icon: 'pi pi-warehouse', label: "Institutions", routerLink: 'institution' },
    { icon: 'pi pi-graduation-cap', label: "Education", routerLink: 'education' },
    { icon: 'pi pi-star', label: "Skills", routerLink: 'skill' },
    { icon: 'pi pi-code', label: "Technologies", routerLink: 'technology' },
    { icon: 'pi pi-folder-open', label: "Projects", routerLink: 'project' },
    { icon: 'pi pi-instagram', label: "Social Networks", routerLink: 'social-network' },
    { icon: 'pi pi-user', label: "Profile", routerLink: 'profile' }
  ];

}
