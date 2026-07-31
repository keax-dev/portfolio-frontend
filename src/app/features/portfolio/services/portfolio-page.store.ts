import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, ErrorHandler, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VISIT_TRACKER } from '@core/analytics/visit-tracker';
import { AlertService } from '@core/services/alert.service';
import { Education } from '@shared/interfaces/education';
import { Course } from '@shared/interfaces/course';
import { Profile } from '@shared/interfaces/profile';
import { Project } from '@shared/interfaces/project';
import { Skill } from '@shared/interfaces/skill';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { PortfolioFacade, PortfolioPageData } from './portfolio.facade';

const DEFAULT_PROFILE: Profile = {
  name: 'KEVIN',
  last_name: 'GALARZA',
  title: 'INFORMATION SYSTEMS ENGINEER',
  title_es: 'INGENIERO EN SISTEMAS DE INFORMACIÓN',
  cv: '',
  cv_es: '',
  image: './images/profile.jpg',
};

@Injectable({ providedIn: 'root' })
export class PortfolioPageStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dataSource = inject(PortfolioFacade);
  private readonly visitTracker = inject(VISIT_TRACKER);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly alert = inject(AlertService);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly profileState = signal<Profile>(DEFAULT_PROFILE);
  private readonly projectState = signal<readonly Project[]>([]);
  private readonly educationState = signal<readonly Education[]>([]);
  private readonly courseState = signal<readonly Course[]>([]);
  private readonly socialNetworkState = signal<readonly SocialNetwork[]>([]);
  private readonly skillState = signal<readonly Skill[]>([]);

  readonly profile = this.profileState.asReadonly();
  readonly projects = this.projectState.asReadonly();
  readonly education = this.educationState.asReadonly();
  readonly courses = this.courseState.asReadonly();
  readonly socialNetworks = this.socialNetworkState.asReadonly();
  readonly skills = this.skillState.asReadonly();

  initialize(path: string): void {
    this.loadPortfolio();
    if (isPlatformBrowser(this.platformId)) {
      this.trackVisit(path);
    }
  }

  stopLoading(): void {
    this.spinner.hide();
  }

  private loadPortfolio(): void {
    this.spinner.show();
    this.dataSource
      .load()
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => this.applyPageData(data),
        error: (error) => this.errorHandler.handleError(error),
      });
  }

  private applyPageData(data: PortfolioPageData): void {
    if (data.profile) {
      this.profileState.set(data.profile);
    }
    this.educationState.set(data.education);
    this.courseState.set(data.courses);
    this.projectState.set(data.projects);
    this.skillState.set(data.skills);
    this.socialNetworkState.set(data.socialNetworks);
    data.errors.forEach((error) => this.alert.httpError(error));
  }

  private trackVisit(path: string): void {
    this.visitTracker
      .track(path)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (error) => this.errorHandler.handleError(error) });
  }
}
