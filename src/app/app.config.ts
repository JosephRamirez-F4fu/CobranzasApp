import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { bearerInterceptor } from './shared/interceptors/bearer.interceptor';
import { credentialsInterceptor } from './shared/interceptors/credentials.interceptor';
import { refreshInterceptor } from './shared/interceptors/refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        bearerInterceptor,
        refreshInterceptor,
      ])
    ),
  ],
};
