import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { DialogModule } from '@angular/cdk/dialog';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { environment } from '@src/environments/environment';
import { routes } from '@src/app.routes';

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
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    { provide: API_BASE_URL, useValue: environment.url },
    importProvidersFrom(DialogModule),
  ],
};
