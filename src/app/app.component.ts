import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NotificationOutletComponent } from '@core/notifications/notification-outlet.component';
import { TranslateService } from '@core/services/translate.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NgxSpinnerModule, NotificationOutletComponent],
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly isPublicRoute = signal(true);

  readonly title = 'Kevin Portfolio';

  constructor() {
    this.syncRouteScope(this.document.location?.pathname || this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.syncRouteScope(event.urlAfterRedirects));

    effect(() => {
      this.document.documentElement.lang = this.isPublicRoute() ? this.translate.getLang : 'en';
    });
  }

  private syncRouteScope(url: string): void {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    this.isPublicRoute.set(normalizedUrl === '/' || normalizedUrl === '');
  }
}
