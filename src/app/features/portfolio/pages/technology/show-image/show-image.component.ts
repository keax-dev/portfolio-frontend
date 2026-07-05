import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

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
  private readonly data = inject<ImageDialogData>(DIALOG_DATA);
  private readonly ref = inject(DialogRef);

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
