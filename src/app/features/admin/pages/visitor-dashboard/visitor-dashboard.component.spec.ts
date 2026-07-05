/**
 * Pruebas unitarias de rangos de fecha, métricas y errores del dashboard de visitantes.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { VisitorService } from '@features/portfolio/services/visitor.service';
import { VisitorDashboardComponent } from './visitor-dashboard.component';

describe('VisitorDashboardComponent', () => {
  let fixture: ComponentFixture<VisitorDashboardComponent>;
  let component: VisitorDashboardComponent;
  let visitor: {
    getDashboard: ReturnType<typeof vi.fn>;
    getVisitorList: ReturnType<typeof vi.fn>;
  };
  let spinner: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  let alert: {
    warning: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    visitor = { getDashboard: vi.fn(), getVisitorList: vi.fn() };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { warning: vi.fn(), httpError: vi.fn() };
    visitor.getDashboard.mockReturnValue(
      of({
        status: true,
        alert: '',
        data: {
          totalVisits: 3,
          uniqueVisitors: 2,
          visitsLast24Hours: 1,
          countries: [],
          cities: [],
        },
      }),
    );
    visitor.getVisitorList.mockReturnValue(
      of({
        status: true,
        alert: '',
        data: [
          {
            id: 1,
            ip: '127.0.0.1',
            visitedAt: '2026-01-01T12:00:00.000Z',
          },
        ],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [VisitorDashboardComponent],
      providers: [
        { provide: VisitorService, useValue: visitor },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VisitorDashboardComponent);
    component = fixture.componentInstance;
  });

  // Caso: initializes a fifteen-day range and loads dashboard data.
  it('initializes a fifteen-day range and loads dashboard data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 5, 12));
    component.ngOnInit();
    vi.useRealTimers();

    expect(component.startDate).toBe('2026-06-20');
    expect(component.endDate).toBe('2026-07-05');
    expect(component.dashboard().totalVisits).toBe(3);
    expect(component.records()).toHaveLength(1);
    expect(spinner.hide).toHaveBeenCalled();
  });

  // Caso: rejects an inverted date range without calling the API.
  it('rejects an inverted date range without calling the API', () => {
    component.startDate = '2026-02-02';
    component.endDate = '2026-02-01';
    component.loadDashboard();

    expect(alert.warning).toHaveBeenCalledWith(
      'The start date cannot be greater than the end date',
    );
    expect(visitor.getDashboard).not.toHaveBeenCalled();
  });

  // Caso: converts local date bounds to complete ISO-day ranges.
  it('converts local date bounds to complete ISO-day ranges', () => {
    component.startDate = '2026-01-10';
    component.endDate = '2026-01-11';
    component.loadDashboard();

    const [startAt, endAt] = visitor.getDashboard.mock.calls[0];
    expect(new Date(startAt).getHours()).toBe(0);
    expect(new Date(endAt).getHours()).toBe(23);
    expect(new Date(endAt).getMilliseconds()).toBe(999);
  });

  // Caso: allows an empty date range.
  it('allows an empty date range', () => {
    component.startDate = '';
    component.endDate = '';
    component.loadDashboard();
    expect(visitor.getDashboard).toHaveBeenCalledWith(undefined, undefined);
  });

  // Caso: reports loading errors and hides the spinner.
  it('reports loading errors and hides the spinner', () => {
    const failure = new Error('offline');
    visitor.getDashboard.mockReturnValue(throwError(() => failure));
    component.loadDashboard();
    expect(alert.httpError).toHaveBeenCalledWith(failure, undefined, false);
    expect(spinner.hide).toHaveBeenCalled();
  });

  // Caso: normalizes missing geographical values.
  it('normalizes missing geographical values', () => {
    expect(component.unknown('Quito')).toBe('Quito');
    expect(component.unknown('')).toBe('Unknown');
    expect(component.unknown(null)).toBe('Unknown');
  });
});
