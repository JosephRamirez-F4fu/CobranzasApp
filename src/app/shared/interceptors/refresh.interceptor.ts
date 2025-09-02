import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginDataService } from '@services/login-data.service';
import { Router } from '@angular/router';
import { LoginResponseDto } from '../../admin/pages/login/interfaces/login-response.dto';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(ApiService);
  const loginDataService = inject(LoginDataService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        return http
          .post<{}, LoginResponseDto>('/auth/refresh', {
            accessToken: '',
          })
          .pipe(
            switchMap((resp) => {
              if (resp && resp.data.accessToken) {
                localStorage.setItem('accessToken', resp.data.accessToken);
              }
              return next(req);
            }),
            catchError((err: HttpErrorResponse) => {
              if (err.status == 403) {
                const institutionId = loginDataService.getInstitutionId();
                if (institutionId) {
                  router.navigate(['/auth/login', { institutionId }]);
                } else {
                  router.navigate(['/admin/login']);
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
