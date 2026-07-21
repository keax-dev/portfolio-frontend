import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '@core/services/alert.service';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { VisitorDashboardComponent } from '@features/visitor/pages/visitor-dashboard.component';
import { of, throwError } from 'rxjs';

describe('VisitorDashboardComponent', () => {
  let fixture: ComponentFixture<VisitorDashboardComponent>;
  let component: VisitorDashboardComponent;
  let visitor: {
    getDashboard: ReturnType<typeof vi.fn>;
    getVisitorList: ReturnType<typeof vi.fn>;
  };
  let alert: {
    warning: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };

  const dashboardResponse = {
    status: true,
    alert: '',
    data: {
      totalVisits: 3,
      uniqueVisitors: 2,
      visitsLast24Hours: 1,
      countries: [],
      cities: [],
    },
  };
  const visitorsResponse = {
    status: true,
    alert: '',
    data: [{ id: 1, ip: '127.0.0.1', visitedAt: '2026-01-01T12:00:00.000Z' }],
  };

  beforeEach(async () => {
    visitor = {
      getDashboard: vi.fn().mockReturnValue(of(dashboardResponse)),
      getVisitorList: vi.fn().mockReturnValue(of(visitorsResponse)),
    };
    alert = { warning: vi.fn(), httpError: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [VisitorDashboardComponent],
      providers: [
        { provide: VisitorService, useValue: visitor },
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VisitorDashboardComponent);
    component = fixture.componentInstance;
  });

  it('initializes a fifteen-day range and loads dashboard data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 5, 12));
    component.ngOnInit();
    vi.useRealTimers();

    expect(component.startDate).toBe('2026-06-20');
    expect(component.endDate).toBe('2026-07-05');
    expect(component.dashboard().totalVisits).toBe(3);
    expect(component.records()).toHaveLength(1);
    expect(component.isLoading()).toBe(false);
  });

  it('rejects an inverted date range without calling the API', () => {
    component.ngOnInit();
    visitor.getDashboard.mockClear();
    component.startDate = '2026-02-02';
    component.endDate = '2026-02-01';
    component.loadDashboard();

    expect(alert.warning).toHaveBeenCalledWith(
      'The start date cannot be greater than the end date',
    );
    expect(visitor.getDashboard).not.toHaveBeenCalled();
  });

  it('converts local date bounds to complete ISO-day ranges', () => {
    component.ngOnInit();
    visitor.getDashboard.mockClear();
    component.startDate = '2026-01-10';
    component.endDate = '2026-01-11';
    component.loadDashboard();

    const [startAt, endAt] = visitor.getDashboard.mock.calls[0];
    expect(new Date(startAt).getHours()).toBe(0);
    expect(new Date(endAt).getHours()).toBe(23);
    expect(new Date(endAt).getMilliseconds()).toBe(999);
  });

  it('reports loading errors and clears the local loading state', () => {
    component.ngOnInit();
    const failure = new Error('offline');
    visitor.getDashboard.mockReturnValue(throwError(() => failure));
    component.loadDashboard();
    expect(alert.httpError).toHaveBeenCalledWith(failure);
    expect(component.isLoading()).toBe(false);
  });

  it('paginates visitor records locally', () => {
    visitor.getVisitorList.mockReturnValue(
      of({
        ...visitorsResponse,
        data: Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          ip: `203.0.113.${index + 1}`,
          visitedAt: '2026-01-01T12:00:00.000Z',
        })),
      }),
    );

    component.ngOnInit();

    expect(component.totalPages()).toBe(2);
    expect(component.paginatedRecords()).toHaveLength(10);
    expect(component.pageStart()).toBe(1);
    expect(component.pageEnd()).toBe(10);

    component.nextPage();

    expect(component.currentPage()).toBe(2);
    expect(component.paginatedRecords()).toHaveLength(2);
    expect(component.pageStart()).toBe(11);
    expect(component.pageEnd()).toBe(12);
  });

  it('normalizes missing geographical values', () => {
    expect(component.unknown('Quito')).toBe('Quito');
    expect(component.unknown('')).toBe('Unknown');
    expect(component.unknown(null)).toBe('Unknown');
  });
});
