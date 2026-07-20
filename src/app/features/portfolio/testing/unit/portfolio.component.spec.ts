import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { DialogService } from '@core/services/dialog.service';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { PortfolioFacade, PortfolioPageData } from '@features/portfolio/services/portfolio.facade';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';

describe('PortfolioComponent', () => {
  let fixture: ComponentFixture<PortfolioComponent>;
  let component: PortfolioComponent;
  let facade: { load: ReturnType<typeof vi.fn> };
  let visitor: { registerVisit: ReturnType<typeof vi.fn> };
  let dialogs: { open: ReturnType<typeof vi.fn> };
  let router: { url: string; navigate: ReturnType<typeof vi.fn> };
  let spinner: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };
  let alert: { httpError: ReturnType<typeof vi.fn> };
  let errorHandler: { handleError: ReturnType<typeof vi.fn> };

  const pageData: PortfolioPageData = {
    profile: {
      name: 'Kevin',
      last_name: 'Galarza',
      title: 'Engineer',
      title_es: 'Ingeniero',
      cv: 'https://example.com/cv-en.pdf',
      cv_es: 'https://example.com/cv-es.pdf',
    },
    education: [],
    projects: [],
    skills: [{ id: 1, name: 'Angular', position: 1 }],
    socialNetworks: [],
    errors: [],
  };

  beforeEach(async () => {
    facade = { load: vi.fn().mockReturnValue(of(pageData)) };
    visitor = { registerVisit: vi.fn().mockReturnValue(of({})) };
    dialogs = { open: vi.fn().mockReturnValue({ afterClosed: () => of(false) }) };
    router = { url: '/projects', navigate: vi.fn().mockResolvedValue(true) };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { httpError: vi.fn() };
    errorHandler = { handleError: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PortfolioFacade, useValue: facade },
        { provide: VisitorService, useValue: visitor },
        { provide: DialogService, useValue: dialogs },
        { provide: Router, useValue: router },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
        { provide: ErrorHandler, useValue: errorHandler },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
  });

  it('loads page data through the facade and always closes the spinner', () => {
    component.getInformation();
    expect(facade.load).toHaveBeenCalledOnce();
    expect(component.profile()).toEqual(pageData.profile);
    expect(component.skillList()).toEqual(pageData.skills);
    expect(spinner.show).toHaveBeenCalledOnce();
    expect(spinner.hide).toHaveBeenCalledOnce();
  });

  it('reports only the resource errors returned by the facade', () => {
    const failure = new Error('projects unavailable');
    facade.load.mockReturnValue(of({ ...pageData, errors: [failure] }));
    component.getInformation();
    expect(alert.httpError).toHaveBeenCalledWith(failure);
  });

  it('registers the current route and reports analytics failures', () => {
    const failure = new Error('blocked');
    visitor.registerVisit.mockReturnValue(throwError(() => failure));
    component.registerVisit();
    expect(visitor.registerVisit).toHaveBeenCalledWith('/projects');
    expect(errorHandler.handleError).toHaveBeenCalledWith(failure);
  });

  it('returns home after completing the contact dialog', () => {
    dialogs.open.mockReturnValue({ afterClosed: () => of(true) });
    component.modalContact();
    expect(router.navigate).toHaveBeenCalledWith(['/'], { fragment: 'home' });
  });
});
