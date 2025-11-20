import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const token = store.accessToken();

  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  const tokenType = store.tokenType() ?? 'Bearer';

  return next(
    req.clone({
      setHeaders: {
        Authorization: `${tokenType} ${token}`,
      },
    })
  );
};
