import {
  HttpContext,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthApiService } from '../../../auth/data-access/auth.api';
import { AuthStore } from '../../auth/auth.store';
import { SKIP_AUTH_REFRESH } from './interceptor-tokens';

export const authRefreshInterceptor: HttpInterceptorFn = (initialReq, next) => {
  const store = inject(AuthStore);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const persistToken = (token?: string | null) => {
    if (token) {
      store.updateAccessToken(token);
    }
  };

  const dispatch = (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          persistToken(event.headers.get('X-New-Access-Token'));
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const shouldSkip =
          req.context.get(SKIP_AUTH_REFRESH) || req.url.includes('/auth/');

        if (error.status !== 401 || shouldSkip) {
          if (error.status === 401 && !req.url.includes('/auth/')) {
            store.clear();
            router.navigate(['/']);
          }
          return throwError(() => error);
        }

        const refreshContext = new HttpContext().set(SKIP_AUTH_REFRESH, true);

        return authApi.fetchCurrentUser(refreshContext).pipe(
          tap(({ newAccessToken }) => persistToken(newAccessToken)),
          switchMap(() => {
            const token = store.accessToken();
            if (!token) {
              store.clear();
              router.navigate(['/']);
              return throwError(() => error);
            }

            const retried = req.clone({
              context: req.context.set(SKIP_AUTH_REFRESH, true),
            });

            return dispatch(retried);
          }),
          catchError((refreshError) => {
            store.clear();
            router.navigate(['/']);
            return throwError(() => refreshError);
          })
        );
      })
    );
  };

  return dispatch(initialReq);
};
