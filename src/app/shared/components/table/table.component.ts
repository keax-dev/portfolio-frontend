import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Column, ColumnKey, ImageColumn, LinkColumn } from '@shared/components/interfaces/column';
import { filterTableRecords, sortTableRecords } from './table-data';

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
  actions: 'Actions',
  deleteRecord: 'Delete record',
  editRecord: 'Edit record',
  viewDetails: 'View details',
  loadErrorDescription: 'The last request failed. Review the connection or try again later.',
  loadingDescription: 'Please wait while the latest records are loaded.',
  loadingRecords: 'Loading records...',
  emptyRecords: 'There are no records.',
  emptySearchResults: 'No records match the current search.',
  newLabel: 'New',
  next: 'Next',
  noImage: 'No image',
  page: 'Page',
  previous: 'Previous',
  recordImage: 'Record image',
  rows: 'Rows',
  searchAriaLabel: 'Search records',
  searchPlaceholder: 'Search',
  sortBy: 'Sort by',
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

  readonly detailsTxt = input('Details');
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
    return filterTableRecords(this.records(), this.columns(), this.searchTerm(), (record, key) =>
      this.readValue(record, key),
    );
  });

  protected readonly sortedRecords = computed(() => {
    const fallbackKey = this.sortName() || this.columns()[0]?.value || '';
    const key = this.sortKey() || fallbackKey;
    const direction = this.sortKey() ? this.sortDirection() : this.order() < 0 ? -1 : 1;

    return sortTableRecords(this.filteredRecords(), key, direction, (record, columnKey) =>
      this.readValue(record, columnKey),
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
    return column.format?.(record) ?? this.readValue(record, column.value);
  }

  imageUrl(record: T, column: ImageColumn<T>): string {
    const value = this.readValue(record, column.value);
    return typeof value === 'string' ? value : '';
  }

  imageAlt(record: T, column: ImageColumn<T>): string {
    return column.imageAlt?.(record) || this.copy().recordImage;
  }

  linkUrl(record: T, column: LinkColumn<T>): string {
    if (column.href) {
      return column.href(record);
    }
    const value = this.readValue(record, column.value);
    return typeof value === 'string' ? value : '';
  }

  isImageColumn(column: Column<T>): column is ImageColumn<T> {
    return column.kind === 'image';
  }

  isLinkColumn(column: Column<T>): column is LinkColumn<T> {
    return column.kind === 'link';
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
}
