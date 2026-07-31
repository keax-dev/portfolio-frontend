import { ProjectComponent } from '@features/portfolio/pages/project/project.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EducationComponent } from '@features/portfolio/pages/education/education.component';
import { PortfolioPageStore } from '@features/portfolio/services/portfolio-page.store';
import { DialogService } from '@core/services/dialog.service';
import { ContactComponent } from '@features/portfolio/pages/contact/contact.component';
import { HeaderComponent } from '@features/portfolio/pages/header/header.component';
import { NavbarComponent } from '@features/portfolio/pages/navbar/navbar.component';
import { FooterComponent } from '@features/portfolio/pages/footer/footer.component';
import { SkillComponent } from '@features/portfolio/pages/skill/skill.component';
import { RevealOnScrollDirective } from '@features/portfolio/directives/reveal-on-scroll.directive';
import { CourseComponent } from '@features/portfolio/pages/course/course.component';
import { portfolioNavigationItems } from '@core/i18n/ui-text';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  OnDestroy,
  Component,
  OnInit,
  inject,
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
    CourseComponent,
    RevealOnScrollDirective,
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(PortfolioPageStore);
  private readonly dialogs = inject(DialogService);
  private readonly router = inject(Router);

  readonly navItems: NavigationItem[] = [...portfolioNavigationItems];
  readonly profile = this.store.profile;
  readonly projectList = this.store.projects;
  readonly educationList = this.store.education;
  readonly courseList = this.store.courses;
  readonly socialNetworkList = this.store.socialNetworks;
  readonly skillList = this.store.skills;

  ngOnInit(): void {
    this.store.initialize(this.router.url || '/');
  }

  ngOnDestroy(): void {
    this.store.stopLoading();
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
