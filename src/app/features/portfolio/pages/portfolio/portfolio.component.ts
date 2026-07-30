import { finalize } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ProjectComponent } from '@features/portfolio/pages/project/project.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EducationComponent } from '@features/portfolio/pages/education/education.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioFacade } from '@features/portfolio/services/portfolio.facade';
import { DialogService } from '@core/services/dialog.service';
import { ContactComponent } from '@features/portfolio/pages/contact/contact.component';
import { HeaderComponent } from '@features/portfolio/pages/header/header.component';
import { NavbarComponent } from '@features/portfolio/pages/navbar/navbar.component';
import { FooterComponent } from '@features/portfolio/pages/footer/footer.component';
import { SkillComponent } from '@features/portfolio/pages/skill/skill.component';
import { RevealOnScrollDirective } from '@features/portfolio/directives/reveal-on-scroll.directive';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { portfolioNavigationItems } from '@core/i18n/ui-text';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { Project } from '@shared/interfaces/project';
import { Education } from '@shared/interfaces/education';
import { Profile } from '@shared/interfaces/profile';
import { Router } from '@angular/router';
import { Skill } from '@shared/interfaces/skill';
import {
  ChangeDetectionStrategy,
  ErrorHandler,
  PLATFORM_ID,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EducationComponent,
    ProjectComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    SkillComponent,
    RevealOnScrollDirective,
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private facade = inject(PortfolioFacade);
  private visitorService = inject(VisitorService);
  private dialogs = inject(DialogService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private alert = inject(AlertService);
  private errorHandler = inject(ErrorHandler);

  readonly profile = signal<Profile>({
    name: 'KEVIN',
    last_name: 'GALARZA',
    title: 'INFORMATION SYSTEMS ENGINEER',
    title_es: 'INGENIERO EN SISTEMAS DE INFORMACIÓN',
    cv: '',
    cv_es: '',
    image: './images/profile.jpg',
  });

  readonly navItems: NavigationItem[] = [...portfolioNavigationItems];

  readonly projectList = signal<readonly Project[]>([]);
  readonly educationList = signal<readonly Education[]>([]);
  readonly socialNetworkList = signal<readonly SocialNetwork[]>([]);
  readonly skillList = signal<readonly Skill[]>([]);

  ngOnInit(): void {
    this.getInformation();
    if (isPlatformBrowser(this.platformId)) {
      this.registerVisit();
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getInformation(): void {
    this.spinner.show();
    this.facade
      .load()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          if (data.profile) this.profile.set(data.profile);
          this.educationList.set(data.education);
          this.projectList.set(data.projects);
          this.skillList.set(data.skills);
          this.socialNetworkList.set(data.socialNetworks);
          data.errors.forEach((error) => this.alert.httpError(error));
        },
      });
  }

  registerVisit(): void {
    this.visitorService
      .registerVisit(this.router.url ?? '/')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (error) => this.errorHandler.handleError(error) });
  }

  modalContact(): void {
    const dialogRef = this.dialogs.open(ContactComponent, {
      data: null,
      desktopWidth: '30%',
      mobileWidth: '90%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            void this.router.navigate(['/'], { fragment: 'home' });
          }
        },
      });
  }
}
