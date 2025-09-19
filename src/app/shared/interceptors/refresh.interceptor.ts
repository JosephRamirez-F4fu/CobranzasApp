import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';
import { AuthService } from '@services/auth.service';
import { LoginDataService } from '@services/login-data.service';
import { ApiService } from '@shared/api/api.service';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

const REFRESH_ENDPOINT = 'auth/refresh';
const RETRY_HEADER = 'x-refresh-attempt';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(ApiService);
  const loginDataService = inject(LoginDataService);
  const authService = inject(AuthService);
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
        return http
          .post<{}, LoginResponseDto>(REFRESH_ENDPOINT, {
            refreshToken: authService._refreshToken()!,
          })
          .pipe(
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
                const institutionCode = loginDataService.getInstitutionCode();
                if (institutionCode) {
                  void router.navigate(['/auth/institucion', institutionCode]);
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
