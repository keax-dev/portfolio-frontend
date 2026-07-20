import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ImageDialogData {
  readonly url?: string;
  readonly alt?: string;
}

@Component({
  selector: 'app-show-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './show-image.component.html',
})
export class ShowImageComponent implements OnInit {
  private readonly data = inject<ImageDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<unknown>>(MatDialogRef);

  urlImg = '';
  altImg = '';

  ngOnInit(): void {
    this.urlImg = this.data.url ?? '';
    this.altImg = this.data.alt ?? '';
  }

  close(): void {
    this.ref.close();
  }
}
