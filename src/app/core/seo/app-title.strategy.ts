import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const DEFAULT_DESCRIPTION =
  'Kevin portfolio with professional profile, education, skills, projects and an administration panel.';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot) ?? 'Portfolio';
    const fullTitle = routeTitle.startsWith('Kevin') ? routeTitle : `Kevin | ${routeTitle}`;
    const description = this.resolveDescription(snapshot.root) ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = this.buildCanonicalUrl(snapshot);

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.updateCanonicalLink(canonicalUrl);
  }

  private buildCanonicalUrl(snapshot: RouterStateSnapshot): string {
    const baseUrl = this.document.location?.origin ?? 'http://localhost:4200';
    return new URL(snapshot.url || '/', baseUrl).toString();
  }

  private resolveDescription(snapshot: ActivatedRouteSnapshot): string | null {
    let current: ActivatedRouteSnapshot | null = snapshot;
    let description: string | null = null;

    while (current) {
      const candidate = current.data['description'];
      if (typeof candidate === 'string' && candidate.trim()) {
        description = candidate.trim();
      }

      current = current.firstChild;
    }

    return description;
  }

  private updateCanonicalLink(url: string): void {
    let link = this.document.head.querySelector('link[rel="canonical"]');

    if (!(link instanceof HTMLLinkElement)) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
