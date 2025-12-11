import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  standalone: false
})
export class ShowImageComponent implements OnInit {

  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  urlImg = '';
  altImg = '';

  ngOnInit(): void {
    this.urlImg = this.config.data.url;
    this.altImg = this.config.data.alt;
  }

  close(): void {
    this.ref.close();
  }

}
