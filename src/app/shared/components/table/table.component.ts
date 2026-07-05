import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Column } from '@shared/components/interfaces/column';

@Component({
  selector: 'app-tabla',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  imports: [ButtonComponent],
})
export class TableComponent<T extends object> {
  readonly records = input.required<readonly T[]>();
  readonly columns = input.required<readonly Column[]>();

  readonly detailsTxt = input('Details');
  readonly sortName = input('');
  readonly newTxt = input('');
  readonly order = input(1);

  readonly details = input(false);
  readonly actions = input(true);
  readonly delete = input(true);
  readonly search = input(true);
  readonly new = input(true);

  readonly itemDetails = output<T>();
  readonly itemDelete = output<T>();
  readonly itemEdit = output<T>();
  readonly itemNew = output<void>();

  protected readonly searchTerm = signal('');
  protected readonly sortKey = signal('');
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

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  updatePageSize(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(Number.isFinite(value) ? value : 10);
    this.page.set(1);
  }

  sortBy(column: Column): void {
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

  cellValue(record: T, column: Column): unknown {
    return this.readValue(record, column.value);
  }

  imageUrl(record: T, column: Column): string {
    const value = this.readValue(record, column.value);
    return typeof value === 'string' ? value : '';
  }

  imageAlt(record: T): string {
    for (const key of ['name', 'title', 'institution_name']) {
      const value = this.readValue(record, key);
      if (typeof value === 'string' && value) {
        return value;
      }
    }

    return 'Record image';
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

  readValue(record: T, key: string): unknown {
    return (record as Record<string, unknown>)[key];
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
