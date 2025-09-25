import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkSheet, WorkBook, utils, write } from 'xlsx';
import { Column } from '../interfaces/column';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-tabla',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: false
})
export class TableComponent<T> implements OnInit {

  @Input() records: T[] = [];
  @Input() columns: Column[] = [];

  @Input() sortName = '';
  @Input() detailsTxt = "Details";
  @Input() newTxt = "";
  @Input() fileName = "Reporte";
  @Input() order = 1;

  @Input() details = false;
  @Input() actions = true;
  @Input() delete = true;
  @Input() search = true;
  @Input() new = true;
  @Input() excel = true;

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

  downloadExcel(): void {
    if (this.records.length !== 0) {
      const data = this.records.map(r => {
        const row: Record<string, unknown> = {};
        this.columns.forEach(c => {
          row[c.name] = (r as Record<string, unknown>)[c.value];
        });
        return row;
      });
      const worksheet: WorkSheet = utils.json_to_sheet(data);
      const workbook: WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
      const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blobData, this.fileName + '.xlsx');
    }
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
