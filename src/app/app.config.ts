import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { AppTitleStrategy } from '@core/seo/app-title.strategy';
import { VISIT_TRACKER } from '@core/analytics/visit-tracker';
import { VISITOR_TRACKING_CONFIG } from '@features/visitor/config/visitor-tracking.config';
import { VisitorService } from '@features/visitor/data-access/visitor.service';
import { environment } from '@src/environments/environment';
import { routes } from '@src/app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: VISIT_TRACKER, useExisting: VisitorService },
    {
      provide: VISITOR_TRACKING_CONFIG,
      useValue: {
        geoUrl: environment.visitorGeoUrl,
        excludedIpPrefixes: environment.visitorExcludedIpPrefixes,
      },
    },
    importProvidersFrom(MatDialogModule),
    provideClientHydration(),
  ],
};
