import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {

  private sessionService = inject(SessionService);

  menuList: MenuItem[] = [
    { icon: 'pi pi-warehouse', label: "Institutions", routerLink: 'institution' },
    { icon: 'pi pi-graduation-cap', label: "Education", routerLink: 'education' },
    { icon: 'pi pi-star', label: "Skills", routerLink: 'skill' },
    { icon: 'pi pi-code', label: "Technologies", routerLink: 'technology' },
    { icon: 'pi pi-folder-open', label: "Projects", routerLink: 'project' },
    { icon: 'pi pi-instagram', label: "Social Networks", routerLink: 'social-network' },
    { icon: 'pi pi-user', label: "Profile", routerLink: 'profile' }
  ];

  ngOnInit(): void {
    this.sessionService.ensureProtectedSession();
  }

  ngOnDestroy(): void {
    this.sessionService.stopExpirationWatcher();
  }

  logOut(): void {
    this.sessionService.logOut();
  }

}
