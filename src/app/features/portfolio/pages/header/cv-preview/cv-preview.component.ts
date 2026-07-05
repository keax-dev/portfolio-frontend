import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { resolveCvPreviewUrl } from './cv-preview-url';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cv-preview.component.css'],
})
export class CvPreviewComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly data = inject<{ readonly url?: string }>(DIALOG_DATA);
  private readonly ref = inject(DialogRef);

  previewUrl: SafeResourceUrl | null = null;
  originalUrl = '';

  ngOnInit(): void {
    this.originalUrl = this.data.url || '';
    const previewUrl = resolveCvPreviewUrl(this.originalUrl);
    this.previewUrl = previewUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl) : null;
  }

  close(): void {
    this.ref.close();
  }
}
