import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PortfolioFacade } from '@features/portfolio/services/portfolio.facade';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { Project } from '@shared/interfaces/project';
import { firstValueFrom, of, throwError } from 'rxjs';

describe('PortfolioFacade', () => {
  const api = <T>(data: T, status = true) => ({ status, alert: '', data });
  let service: Record<string, ReturnType<typeof vi.fn>>;
  let facade: PortfolioFacade;

  beforeEach(() => {
    service = {
      getProfile: vi.fn().mockReturnValue(of(api(null))),
      getEducation: vi.fn().mockReturnValue(of(api([]))),
      getProject: vi.fn().mockReturnValue(of(api([]))),
      getSkill: vi.fn().mockReturnValue(of(api([]))),
      getSocialNetwork: vi.fn().mockReturnValue(of(api([]))),
    };
    TestBed.configureTestingModule({
      providers: [PortfolioFacade, { provide: PortfolioService, useValue: service }],
    });
    facade = TestBed.inject(PortfolioFacade);
  });

  it('sorts projects and every nested ordered collection without mutating the response', async () => {
    const projects: readonly Project[] = [project(2), project(1)];
    service['getProject'].mockReturnValue(of(api(projects)));
    const result = await firstValueFrom(facade.load());

    expect(result.projects.map((item) => item.position)).toEqual([1, 2]);
    expect(result.projects[0].technologies.map((item) => item.position)).toEqual([1, 2]);
    expect(projects.map((item) => item.position)).toEqual([2, 1]);
  });

  it('keeps successful resources when another resource fails', async () => {
    const failure = new HttpErrorResponse({ status: 500 });
    service['getProject'].mockReturnValue(throwError(() => failure));
    service['getSkill'].mockReturnValue(of(api([{ id: 1, name: 'Angular', position: 1 }])));
    const result = await firstValueFrom(facade.load());

    expect(result.projects).toEqual([]);
    expect(result.skills).toHaveLength(1);
    expect(result.errors).toEqual([failure]);
  });

  it('treats an empty-resource 400 response as an empty collection without reporting it', async () => {
    service['getProject'].mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { status: false, alert: 'No projects', data: [] },
          }),
      ),
    );
    const result = await firstValueFrom(facade.load());
    expect(result.projects).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  function project(position: number): Project {
    return {
      id: position,
      title: `Project ${position}`,
      title_es: `Proyecto ${position}`,
      description: 'Description',
      description_es: 'Descripción',
      position,
      technologies: [
        { relation_id: 2, id: 2, name: 'Laravel', position: 2 },
        { relation_id: 1, id: 1, name: 'Angular', position: 1 },
      ],
      links: [
        { id: 2, type: 'GITHUB_BACKEND', url: 'https://example.com/api', position: 2 },
        { id: 1, type: 'DEPLOY', url: 'https://example.com', position: 1 },
      ],
      images: [
        { id: 2, url: 'two.png', position: 2 },
        { id: 1, url: 'one.png', position: 1 },
      ],
    };
  }
});
