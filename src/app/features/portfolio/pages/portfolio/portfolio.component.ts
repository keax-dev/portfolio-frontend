import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import {
  Component,
  inject,
  DestroyRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { TechnologyComponent } from '@features/portfolio/pages/technology/technology.component';
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
import { SocialNetwork } from '@shared/interfaces/social-network';
import { AlertService } from '@core/services/alert.service';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Technology } from '@shared/interfaces/technology';
import { Education } from '@shared/interfaces/education';
import { Profile } from '@shared/interfaces/profile';
import { Router } from '@angular/router';
import { Skill } from '@shared/interfaces/skill';
import { NavigationItem } from '@shared/interfaces/navigation-item';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    NavbarComponent,
    EducationComponent,
    SkillComponent,
    TechnologyComponent,
    FooterComponent,
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private portfolioService = inject(PortfolioService);
  private visitorService = inject(VisitorService);
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);
  private router = inject(Router);

  readonly profile = signal<Profile>({
    name: 'KEVIN',
    last_name: 'GALARZA',
    title: 'INFORMATION SYSTEMS ENGINEER',
    title_es: 'INGENIERO EN SISTEMAS DE INFORMACIÓN',
    cv: '',
    image: './images/profile.jpg',
  });

  readonly navItems: NavigationItem[] = [
    { label: 'Home', label_es: 'Home', routerLink: '#home' },
    { label: 'Education', label_es: 'Educación', routerLink: '#education' },
    { label: 'Skills', label_es: 'Habilidades', routerLink: '#skills' },
    { label: 'Portfolio', label_es: 'Portafolio', routerLink: '#portfolio' },
    { label: 'Contact', label_es: 'Contacto', routerLink: '' },
    { label: 'Login', label_es: 'Login', routerLink: '/login' },
  ];

  readonly technologyList = signal<readonly Technology[]>([]);
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
      this.uploadTechnology(),
      this.uploadEducation(),
      this.uploadProfile(),
      this.uploadSkill(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => this.spinner.hide(),
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
        if (result.status) this.profile.set(result.data);
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

  uploadTechnology(): Observable<null> {
    return this.portfolioService.getTechnology().pipe(
      catchError((e) => this.infoEmpty<Technology[]>(e)),
      takeUntilDestroyed(this.destroyRef),
      tap((result) => {
        if (result.status) {
          this.technologyList.set(
            result.data
              .map((technology) => ({
                ...technology,
                projects: [...technology.projects].sort((a, b) => a.position - b.position),
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
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result) void this.router.navigate(['/'], { fragment: 'home' });
      },
    });
  }
}
