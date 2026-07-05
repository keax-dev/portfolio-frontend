import { Visitor, VisitorDashboard } from '@features/portfolio/interfaces/visitor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { VisitorService } from '@features/portfolio/services/visitor.service';
import { AlertService } from '@core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnDestroy,
  inject,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-visitor-dashboard',
  templateUrl: './visitor-dashboard.component.html',
  styleUrls: ['./visitor-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FormsModule],
})
export class VisitorDashboardComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly visitorService = inject(VisitorService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly alert = inject(AlertService);

  readonly dashboard = signal<VisitorDashboard>({
    totalVisits: 0,
    uniqueVisitors: 0,
    visitsLast24Hours: 0,
    countries: [],
    cities: [],
  });

  readonly records = signal<readonly Visitor[]>([]);
  startDate = '';
  endDate = '';

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  loadDashboard(): void {
    if (!this.isValidDateRange()) {
      this.alert.warning('The start date cannot be greater than the end date');
      return;
    }

    const startAt = this.toStartOfDayIso(this.startDate);
    const endAt = this.toEndOfDayIso(this.endDate);

    this.spinner.show();
    forkJoin({
      dashboard: this.visitorService.getDashboard(startAt, endAt),
      visitors: this.visitorService.getVisitorList(startAt, endAt),
    })
      .pipe(
        finalize(() => this.spinner.hide()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          this.dashboard.set(result.dashboard.data);
          this.records.set(result.visitors.data);
        },
        error: (error) => this.alert.httpError(error),
      });
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
}
