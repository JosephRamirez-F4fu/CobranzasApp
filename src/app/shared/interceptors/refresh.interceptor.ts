import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginDataService } from '@services/login-data.service';
import { Router } from '@angular/router';
import { LoginResponseDto } from '../../admin/pages/login/interfaces/login-response.dto';

const REFRESH_ENDPOINT = '/auth/refresh';
const RETRY_HEADER = 'x-refresh-attempt';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(ApiService);
  const loginDataService = inject(LoginDataService);
  const router = inject(Router);

  // Si la petición es la del refresh o ya fue reintentada, no intentar refresh para evitar bucles
  if (
    req.url.includes(REFRESH_ENDPOINT) ||
    req.headers.get(RETRY_HEADER) === '1'
  ) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        // Intentar refrescar el token (el refresh token va por cookie)
        return http.post<{}, LoginResponseDto>(REFRESH_ENDPOINT, {}).pipe(
          switchMap((resp) => {
            // ApiService devuelve ApiResponse<T>, por lo que token suele estar en resp.data
            if (resp && (resp as any).data?.accessToken) {
              localStorage.setItem(
                'accessToken',
                (resp as any).data.accessToken
              );
            }

            // Reintentar la petición original marcándola para no reintentar otra vez
            const retriedReq = req.clone({
              setHeaders: {
                [RETRY_HEADER]: '1',
              },
            });

            return next(retriedReq);
          }),
          catchError((err: HttpErrorResponse) => {
            // Si el refresh falla con 403, redirigir al login según institution
            if (err.status == 403) {
              const institutionId = loginDataService.getInstitutionId();
              if (institutionId) {
                void router.navigate(['/auth/login', institutionId]);
              } else {
                void router.navigate(['/admin/login']);
              }
            }
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
