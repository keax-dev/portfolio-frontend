import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrls: ['./cv-preview.component.css']
})
export class CvPreviewComponent implements OnInit {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly sanitizer = inject(DomSanitizer);

  previewUrl!: SafeResourceUrl;
  originalUrl = '';

  ngOnInit(): void {
    this.originalUrl = this.config.data?.url || '';
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.resolvePreviewUrl(this.originalUrl)
    );
  }

  close(): void {
    this.ref.close();
  }

  private resolvePreviewUrl(url: string): string {
    const googleDriveId = this.extractGoogleDriveFileId(url);

    if (googleDriveId) {
      return `https://drive.google.com/file/d/${googleDriveId}/preview`;
    }

    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
  }

  private extractGoogleDriveFileId(url: string): string | null {
    if (!url) {
      return null;
    }

    const filePathMatch = url.match(/\/file\/d\/([^/]+)/);
    if (filePathMatch?.[1]) {
      return filePathMatch[1];
    }

    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get('id');
    } catch {
      return null;
    }
  }

}
