import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Column, ColumnKey } from '@shared/components/interfaces/column';
import { uiText } from '@core/i18n/ui-text';

export interface TableCopy {
  readonly actions: string;
  readonly deleteRecord: string;
  readonly editRecord: string;
  readonly viewDetails: string;
  readonly loadErrorDescription: string;
  readonly loadingDescription: string;
  readonly loadingRecords: string;
  readonly emptyRecords: string;
  readonly emptySearchResults: string;
  readonly newLabel: string;
  readonly next: string;
  readonly noImage: string;
  readonly page: string;
  readonly previous: string;
  readonly recordImage: string;
  readonly rows: string;
  readonly searchAriaLabel: string;
  readonly searchPlaceholder: string;
  readonly sortBy: string;
}

const DEFAULT_TABLE_COPY: TableCopy = {
  actions: uiText.table.actions.en,
  deleteRecord: uiText.table.deleteRecord.en,
  editRecord: uiText.table.editRecord.en,
  viewDetails: uiText.table.viewDetails.en,
  loadErrorDescription: uiText.table.loadErrorDescription.en,
  loadingDescription: uiText.table.loadingDescription.en,
  loadingRecords: uiText.table.loadingRecords.en,
  emptyRecords: uiText.table.emptyRecords.en,
  emptySearchResults: uiText.table.emptySearchResults.en,
  newLabel: uiText.table.newLabel.en,
  next: uiText.table.next.en,
  noImage: uiText.table.noImage.en,
  page: uiText.table.page.en,
  previous: uiText.table.previous.en,
  recordImage: uiText.table.recordImage.en,
  rows: uiText.table.rows.en,
  searchAriaLabel: uiText.table.searchAriaLabel.en,
  searchPlaceholder: uiText.table.searchPlaceholder.en,
  sortBy: uiText.table.sortBy.en,
};

@Component({
  selector: 'app-tabla',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  imports: [ButtonComponent],
})
export class TableComponent<T extends object> {
  readonly records = input.required<readonly T[]>();
  readonly columns = input.required<readonly Column<T>[]>();
  readonly copy = input<Readonly<TableCopy>>(DEFAULT_TABLE_COPY);

  readonly detailsTxt = input(uiText.table.details.en);
  readonly sortName = input<ColumnKey<T> | ''>('');
  readonly newTxt = input('');
  readonly order = input(1);

  readonly details = input(false);
  readonly actions = input(true);
  readonly delete = input(true);
  readonly search = input(true);
  readonly new = input(true);
  readonly loading = input(false);
  readonly errorMessage = input('');

  readonly itemDetails = output<T>();
  readonly itemDelete = output<T>();
  readonly itemEdit = output<T>();
  readonly itemNew = output<void>();

  protected readonly searchTerm = signal('');
  protected readonly sortKey = signal<ColumnKey<T> | ''>('');
  protected readonly sortDirection = signal<1 | -1>(1);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly filteredRecords = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase();
    if (!term) {
      return [...this.records()];
    }

    return this.records().filter((record) =>
      this.columns().some((column) =>
        String(this.readValue(record, column.value) ?? '')
          .toLocaleLowerCase()
          .includes(term),
      ),
    );
  });

  protected readonly sortedRecords = computed(() => {
    const fallbackKey = this.sortName() || this.columns()[0]?.value || '';
    const key = this.sortKey() || fallbackKey;
    const direction = this.sortKey() ? this.sortDirection() : this.order() < 0 ? -1 : 1;

    if (!key) {
      return this.filteredRecords();
    }

    return [...this.filteredRecords()].sort(
      (left, right) =>
        this.compare(this.readValue(left, key), this.readValue(right, key)) * direction,
    );
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.sortedRecords().length / this.pageSize())),
  );

  protected readonly currentPage = computed(() => Math.min(this.page(), this.pageCount()));

  protected readonly visibleRecords = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedRecords().slice(start, start + this.pageSize());
  });

  protected readonly totalColumns = computed(
    () => this.columns().length + (this.actions() ? 1 : 0) + (this.details() ? 1 : 0),
  );

  protected readonly newButtonText = computed(() =>
    this.newTxt() ? `${this.copy().newLabel} ${this.newTxt()}` : this.copy().newLabel,
  );

  protected readonly emptyStateTitle = computed(() => {
    if (this.loading()) {
      return this.copy().loadingRecords;
    }

    if (this.errorMessage()) {
      return this.errorMessage();
    }

    return this.searchTerm().trim() ? this.copy().emptySearchResults : this.copy().emptyRecords;
  });

  protected readonly emptyStateDescription = computed(() => {
    if (this.loading()) {
      return this.copy().loadingDescription;
    }

    if (this.errorMessage()) {
      return this.copy().loadErrorDescription;
    }

    return '';
  });

  protected readonly stateIcon = computed(() => {
    if (this.loading()) {
      return 'pi pi-spin pi-spinner';
    }

    if (this.errorMessage()) {
      return 'pi pi-exclamation-triangle';
    }

    return 'pi pi-inbox';
  });

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  updatePageSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(Number.isFinite(value) ? value : 10);
    this.page.set(1);
  }

  sortBy(column: Column<T>): void {
    if (this.sortKey() === column.value) {
      this.sortDirection.update((direction) => (direction === 1 ? -1 : 1));
      return;
    }

    this.sortKey.set(column.value);
    this.sortDirection.set(1);
  }

  previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.page.update((page) => Math.min(this.pageCount(), page + 1));
  }

  cellValue(record: T, column: Column<T>): unknown {
    return this.readValue(record, column.value);
  }

  imageUrl(record: T, column: Column<T>): string {
    const value = this.readValue(record, column.value);
    return typeof value === 'string' ? value : '';
  }

  imageAlt(record: T, column: Column<T>): string {
    return column.imageAlt?.(record) || this.copy().recordImage;
  }

  newItem(): void {
    this.itemNew.emit();
  }

  modifyItem(item: T): void {
    this.itemEdit.emit(item);
  }

  deleteItem(item: T): void {
    this.itemDelete.emit(item);
  }

  detailsItem(item: T): void {
    this.itemDetails.emit(item);
  }

  readValue(record: T, key: ColumnKey<T>): unknown {
    return record[key];
  }

  compare(left: unknown, right: unknown): number {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
