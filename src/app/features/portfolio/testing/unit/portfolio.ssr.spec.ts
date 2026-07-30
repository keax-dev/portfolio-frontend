import { ErrorHandler, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VISIT_TRACKER } from '@core/analytics/visit-tracker';
import { AlertService } from '@core/services/alert.service';
import { DialogService } from '@core/services/dialog.service';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { PortfolioFacade } from '@features/portfolio/services/portfolio.facade';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

describe('PortfolioComponent server rendering', () => {
  it('does not register a visit while prerendering', async () => {
    const visitTracker = { track: vi.fn().mockReturnValue(of(undefined)) };

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: PortfolioFacade,
          useValue: {
            load: () =>
              of({
                profile: null,
                education: [],
                courses: [],
                projects: [],
                skills: [],
                socialNetworks: [],
                errors: [],
              }),
          },
        },
        { provide: VISIT_TRACKER, useValue: visitTracker },
        { provide: DialogService, useValue: { open: vi.fn() } },
        { provide: Router, useValue: { url: '/', navigate: vi.fn() } },
        { provide: NgxSpinnerService, useValue: { show: vi.fn(), hide: vi.fn() } },
        { provide: AlertService, useValue: { httpError: vi.fn() } },
        { provide: ErrorHandler, useValue: { handleError: vi.fn() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PortfolioComponent);
    fixture.componentInstance.ngOnInit();

    expect(visitTracker.track).not.toHaveBeenCalled();
  });
});
