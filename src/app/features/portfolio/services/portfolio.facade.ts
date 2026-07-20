import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { Education } from '@shared/interfaces/education';
import { Profile } from '@shared/interfaces/profile';
import { Project } from '@shared/interfaces/project';
import { Skill } from '@shared/interfaces/skill';
import { SocialNetwork } from '@shared/interfaces/social-network';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { PortfolioService } from './portfolio.service';

export interface PortfolioPageData {
  readonly profile: Profile | null;
  readonly education: readonly Education[];
  readonly projects: readonly Project[];
  readonly skills: readonly Skill[];
  readonly socialNetworks: readonly SocialNetwork[];
  readonly errors: readonly unknown[];
}

interface ResourceResult<T> {
  readonly data: T;
  readonly error: unknown | null;
}

@Injectable({ providedIn: 'root' })
export class PortfolioFacade {
  private readonly portfolioService = inject(PortfolioService);

  load(): Observable<PortfolioPageData> {
    return forkJoin({
      profile: this.loadResource(this.portfolioService.getProfile(), null),
      education: this.loadResource(
        this.portfolioService.getEducation(),
        [] as readonly Education[],
      ),
      projects: this.loadResource(this.portfolioService.getProject(), [] as readonly Project[]),
      skills: this.loadResource(this.portfolioService.getSkill(), [] as readonly Skill[]),
      socialNetworks: this.loadResource(
        this.portfolioService.getSocialNetwork(),
        [] as readonly SocialNetwork[],
      ),
    }).pipe(
      map((result) => ({
        profile: result.profile.data,
        education: sortByPosition(result.education.data),
        projects: normalizeProjects(result.projects.data),
        skills: sortByPosition(result.skills.data),
        socialNetworks: sortByPosition(result.socialNetworks.data),
        errors: Object.values(result)
          .map((resource) => resource.error)
          .filter((error): error is unknown => error !== null),
      })),
    );
  }

  private loadResource<T>(
    request: Observable<ApiResponse<T>>,
    fallback: T,
  ): Observable<ResourceResult<T>> {
    return request.pipe(
      map((response) => ({
        data: response.status ? response.data : fallback,
        error: response.status ? null : response,
      })),
      catchError((error: unknown) =>
        of({
          data: fallback,
          error: isEmptyResourceResponse(error) ? null : error,
        }),
      ),
    );
  }
}

export function normalizeProjects(projects: readonly Project[]): readonly Project[] {
  return projects
    .map((project) => ({
      ...project,
      technologies: sortByPosition(project.technologies),
      links: sortByPosition(project.links),
      images: sortByPosition(project.images),
    }))
    .sort((left, right) => left.position - right.position);
}

export function sortByPosition<T extends { readonly position: number }>(
  values: readonly T[],
): readonly T[] {
  return [...values].sort((left, right) => left.position - right.position);
}

function isEmptyResourceResponse(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse) || error.status !== 400) return false;
  if (!error.error || typeof error.error !== 'object') return false;

  return (error.error as Record<string, unknown>)['status'] === false;
}
