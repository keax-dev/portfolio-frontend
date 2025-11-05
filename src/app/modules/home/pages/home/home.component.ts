import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserInfoService } from '@app/shared/services/user-info.service';
import { HeaderService } from '@app/home/services/header.service';
import { AlertService } from '@app/shared/services/alert.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {

  private userInfoService = inject(UserInfoService);
  private headerService = inject(HeaderService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  menuList: MenuItem[] = [
    { icon: 'pi pi-warehouse', label: "Institutions", routerLink: 'institution' },
    { icon: 'pi pi-graduation-cap', label: "Education", routerLink: 'education' },
    { icon: 'pi pi-star', label: "Skills", routerLink: 'skill' },
    { icon: 'pi pi-code', label: "Technologies", routerLink: 'technology' },
    { icon: 'pi pi-folder-open', label: "Projects", routerLink: 'project' },
    { icon: 'pi pi-instagram', label: "Social Networks", routerLink: 'social-network' },
    { icon: 'pi pi-user', label: "Profile", routerLink: 'profile' }
  ];

  logoutTimeoutId!: number;

  ngOnInit(): void {
    const expire = new Date(this.userInfoService.getTimeExpiration).getTime();
    const delay = expire - Date.now();

    if (delay < 0) {
      this.logOut();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      this.logOut();
    }, delay);

    this.logoutTimeoutId = timeoutId;
  }

  ngOnDestroy(): void {
    if (this.logoutTimeoutId) clearTimeout(this.logoutTimeoutId);
  }

  logOut(): void {
    localStorage.clear();
    this.userInfoService.setInfo();
    this.headerService.loadHeaders();
    this.alertService.success("Log out")
    this.router.navigateByUrl('/');
  }

}
