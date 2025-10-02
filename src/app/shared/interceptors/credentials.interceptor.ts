import type { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentialsRequest = req.clone({ withCredentials: true });
  return next(withCredentialsRequest);
};
