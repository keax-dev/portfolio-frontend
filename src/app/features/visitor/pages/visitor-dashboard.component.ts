import { Visitor, VisitorDashboard } from '@features/visitor/models/visitor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, defer, EMPTY, finalize, forkJoin, Subject, switchMap } from 'rxjs';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { AlertService } from '@core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

interface VisitorDateRange {
  readonly startAt?: string;
  readonly endAt?: string;
}

@Component({
  selector: 'app-visitor-dashboard',
  templateUrl: './visitor-dashboard.component.html',
  styleUrls: ['./visitor-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FormsModule],
})
export class VisitorDashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly visitorService = inject(VisitorService);
  private readonly alert = inject(AlertService);
  private readonly dateRangeRequests = new Subject<VisitorDateRange>();

  readonly dashboard = signal<VisitorDashboard>({
    totalVisits: 0,
    uniqueVisitors: 0,
    visitsLast24Hours: 0,
    countries: [],
    cities: [],
  });

  readonly currentPage = signal(1);
  readonly records = signal<readonly Visitor[]>([]);
  readonly pageSize = 10;
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.records().length / this.pageSize)),
  );
  readonly pageStart = computed(() => {
    if (!this.records().length) {
      return 0;
    }

    return (this.activePage() - 1) * this.pageSize + 1;
  });
  readonly pageEnd = computed(() =>
    Math.min(this.records().length, this.activePage() * this.pageSize),
  );
  readonly paginatedRecords = computed(() => {
    const start = (this.activePage() - 1) * this.pageSize;
    return this.records().slice(start, start + this.pageSize);
  });
  readonly isLoading = signal(false);
  startDate = '';
  endDate = '';

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.observeDateRangeRequests();
    this.loadDashboard();
  }

  loadDashboard(): void {
    if (!this.isValidDateRange()) {
      this.alert.warning('The start date cannot be greater than the end date');
      return;
    }

    const startAt = this.toStartOfDayIso(this.startDate);
    const endAt = this.toEndOfDayIso(this.endDate);

    this.dateRangeRequests.next({ startAt, endAt });
  }

  private observeDateRangeRequests(): void {
    this.dateRangeRequests
      .pipe(
        switchMap((range) =>
          defer(() => {
            this.isLoading.set(true);
            return forkJoin({
              dashboard: this.visitorService.getDashboard(range.startAt, range.endAt),
              visitors: this.visitorService.getVisitorList(range.startAt, range.endAt),
            }).pipe(
              catchError((error: unknown) => {
                this.alert.httpError(error);
                return EMPTY;
              }),
              finalize(() => this.isLoading.set(false)),
            );
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.dashboard.set(result.dashboard.data);
          this.records.set(result.visitors.data);
          this.currentPage.set(1);
        },
      });
  }

  previousPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }

  unknown(value?: string | null): string {
    return value || 'Unknown';
  }

  setDefaultDateRange(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 15);

    this.startDate = this.toDateInputValue(startDate);
    this.endDate = this.toDateInputValue(endDate);
  }

  isValidDateRange(): boolean {
    if (!this.startDate || !this.endDate) {
      return true;
    }

    return this.localDate(this.startDate).getTime() <= this.localDate(this.endDate).getTime();
  }

  toStartOfDayIso(value: string): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = this.localDate(value);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  toEndOfDayIso(value: string): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = this.localDate(value);
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  }

  toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  localDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private activePage(): number {
    return Math.min(this.currentPage(), this.totalPages());
  }
}
