import { ErrorHandler, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VISIT_TRACKER } from '@core/analytics/visit-tracker';
import { AlertService } from '@core/services/alert.service';
import { PortfolioPageStore } from '@features/portfolio/services/portfolio-page.store';
import { PortfolioFacade, PortfolioPageData } from '@features/portfolio/services/portfolio.facade';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';

describe('PortfolioPageStore', () => {
  const pageData: PortfolioPageData = {
    profile: {
      name: 'Kevin',
      last_name: 'Galarza',
      title: 'Engineer',
      title_es: 'Ingeniero',
      cv: 'cv-en.pdf',
      cv_es: 'cv-es.pdf',
    },
    education: [],
    courses: [],
    projects: [],
    skills: [{ id: 1, name: 'Angular', position: 1 }],
    socialNetworks: [],
    errors: [new Error('optional resource unavailable')],
  };

  let facade: { load: ReturnType<typeof vi.fn> };
  let tracker: { track: ReturnType<typeof vi.fn> };
  let spinner: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };
  let alert: { httpError: ReturnType<typeof vi.fn> };
  let errorHandler: { handleError: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    facade = { load: vi.fn().mockReturnValue(of(pageData)) };
    tracker = { track: vi.fn().mockReturnValue(of(undefined)) };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { httpError: vi.fn() };
    errorHandler = { handleError: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PortfolioPageStore,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: PortfolioFacade, useValue: facade },
        { provide: VISIT_TRACKER, useValue: tracker },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
        { provide: ErrorHandler, useValue: errorHandler },
      ],
    });
  });

  it('loads page state, reports partial errors and tracks the route', () => {
    const store = TestBed.inject(PortfolioPageStore);
    store.initialize('/projects');

    expect(store.profile()).toEqual(pageData.profile);
    expect(store.skills()).toEqual(pageData.skills);
    expect(alert.httpError).toHaveBeenCalledWith(pageData.errors[0]);
    expect(tracker.track).toHaveBeenCalledWith('/projects');
    expect(spinner.show).toHaveBeenCalledOnce();
    expect(spinner.hide).toHaveBeenCalledOnce();
  });

  it('reports an unexpected page-load failure and always hides the spinner', () => {
    const failure = new Error('page unavailable');
    facade.load.mockReturnValue(throwError(() => failure));
    const store = TestBed.inject(PortfolioPageStore);

    store.initialize('/');

    expect(errorHandler.handleError).toHaveBeenCalledWith(failure);
    expect(spinner.hide).toHaveBeenCalledOnce();
  });

  it('does not track visits during server rendering', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const store = TestBed.inject(PortfolioPageStore);

    store.initialize('/');

    expect(tracker.track).not.toHaveBeenCalled();
  });

  it('can explicitly stop the global loading indicator', () => {
    TestBed.inject(PortfolioPageStore).stopLoading();
    expect(spinner.hide).toHaveBeenCalledOnce();
  });
});
