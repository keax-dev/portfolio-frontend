import { catchError, finalize, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { ProjectComponent } from '@features/portfolio/pages/project/project.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EducationComponent } from '@features/portfolio/pages/education/education.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { ParameterService } from '@core/services/parameter.service';
import { ContactComponent } from '@features/portfolio/pages/contact/contact.component';
import { HeaderComponent } from '@features/portfolio/pages/header/header.component';
import { NavbarComponent } from '@features/portfolio/pages/navbar/navbar.component';
import { FooterComponent } from '@features/portfolio/pages/footer/footer.component';
import { SkillComponent } from '@features/portfolio/pages/skill/skill.component';
import { VisitorService } from '@features/portfolio/services/visitor.service';
import { portfolioNavigationItems } from '@core/i18n/ui-text';
import { NavigationItem } from '@shared/interfaces/navigation-item';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Project } from '@shared/interfaces/project';
import { Education } from '@shared/interfaces/education';
import { Profile } from '@shared/interfaces/profile';
import { Router } from '@angular/router';
import { Skill } from '@shared/interfaces/skill';
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProjectComponent,
    EducationComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    SkillComponent,
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private portfolioService = inject(PortfolioService);
  private visitorService = inject(VisitorService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private alert = inject(AlertService);

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
    this.registerVisit();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  getInformation(): void {
    this.spinner.show();
    forkJoin([
      this.uploadSocialNetwork(),
      this.uploadProject(),
      this.uploadEducation(),
      this.uploadProfile(),
      this.uploadSkill(),
    ])
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: (error) => this.alert.httpError(error),
      });
  }

  registerVisit(): void {
    this.visitorService
      .registerVisit(this.router.url || '/')
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  uploadProfile(): Observable<null> {
    return this.portfolioService.getProfile().pipe(
      catchError((e) => this.infoEmpty<Profile>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.profile.set(result.data);
        }
      }),
      map(() => null),
    );
  }

  uploadEducation(): Observable<null> {
    return this.portfolioService.getEducation().pipe(
      catchError((e) => this.infoEmpty<Education[]>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.educationList.set([...result.data].sort((a, b) => a.position - b.position));
        }
      }),
      map(() => null),
    );
  }

  uploadSkill(): Observable<null> {
    return this.portfolioService.getSkill().pipe(
      catchError((e) => this.infoEmpty<Skill[]>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.skillList.set([...result.data].sort((a, b) => a.position - b.position));
        }
      }),
      map(() => null),
    );
  }

  uploadProject(): Observable<null> {
    return this.portfolioService.getProject().pipe(
      catchError((e) => this.infoEmpty<Project[]>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.projectList.set(
            result.data
              .map((project) => ({
                ...project,
                technologies: [...project.technologies].sort((a, b) => a.position - b.position),
                links: [...project.links].sort((a, b) => a.position - b.position),
                images: [...project.images].sort((a, b) => a.position - b.position),
              }))
              .sort((a, b) => a.position - b.position),
          );
        }
      }),
      map(() => null),
    );
  }

  uploadSocialNetwork(): Observable<null> {
    return this.portfolioService.getSocialNetwork().pipe(
      catchError((e) => this.infoEmpty<SocialNetwork[]>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.socialNetworkList.set([...result.data].sort((a, b) => a.position - b.position));
        }
      }),
      map(() => null),
    );
  }

  infoEmpty<T>(e: HttpErrorResponse): Observable<ApiResponse<T>> {
    if (e.status === 400) {
      return of(e.error as ApiResponse<T>);
    }

    return throwError(() => e);
  }

  modalContact(): void {
    const dialogRef = this.parameter.openDialog(ContactComponent, null, '30%', '90%');
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
