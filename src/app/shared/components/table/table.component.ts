import { Component, computed, output, input } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Column } from '@shared/components/interfaces/column';

@Component({
    selector: 'app-tabla',
    templateUrl: './table.component.html',
    imports: [ButtonComponent, TableModule, PrimeTemplate, IconField, InputIcon, InputText]
})
export class TableComponent<T> {

  readonly records = input<T[]>([]);
  readonly columns = input<Column[]>([]);

  readonly detailsTxt = input("Details");
  readonly fileName = input("Reporte");
  readonly sortName = input('');
  readonly newTxt = input("");
  readonly order = input(1);

  readonly details = input(false);
  readonly actions = input(true);
  readonly delete = input(true);
  readonly search = input(true);
  readonly excel = input(true);
  readonly new = input(true);

  readonly itemDetails = output<T>();
  readonly itemDelete = output<T>();
  readonly itemEdit = output<T>();
  readonly itemNew = output<void>();

  protected readonly columnNames = computed(() => this.columns().map(c => c.value));
  protected readonly resolvedSortName = computed(() => this.sortName() || this.columnNames()[0]);

  valueSearch(event: Event): string {
    const input = event.target as HTMLInputElement;
    return input.value || '';
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

}
