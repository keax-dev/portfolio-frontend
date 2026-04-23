import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from '../interfaces/column';

@Component({
  selector: 'app-tabla',
  templateUrl: './table.component.html',
  standalone: false
})
export class TableComponent<T> implements OnInit {

  @Input() records: T[] = [];
  @Input() columns: Column[] = [];

  @Input() detailsTxt = "Details";
  @Input() fileName = "Reporte";
  @Input() sortName = '';
  @Input() newTxt = "";
  @Input() order = 1;

  @Input() details = false;
  @Input() actions = true;
  @Input() delete = true;
  @Input() search = true;
  @Input() excel = true;
  @Input() new = true;

  @Output() itemDetails = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() itemEdit = new EventEmitter();
  @Output() itemNew = new EventEmitter();

  columnNames: string[] = [];

  ngOnInit(): void {
    this.columnNames = this.columns.map(c => c.value);
    if (!this.sortName) this.sortName = this.columnNames[0];
  }

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
