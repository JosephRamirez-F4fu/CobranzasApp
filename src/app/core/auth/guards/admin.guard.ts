import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { AuthStore } from '../auth.store';
import { AuthApiService } from '../../../auth/data-access/auth.api';

export const adminGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const accessToken = store.accessToken();
  const admin = store.admin();

  const redirect = () => {
    store.clear();
    return router.createUrlTree(['/']);
  };

  if (!accessToken || !admin) {
    return redirect();
  }

  return authApi.fetchCurrentUser().pipe(
    tap(({ usuario, newAccessToken }) => {
      store.setSession({
        accessToken: newAccessToken ?? accessToken,
        tokenType: store.tokenType() ?? 'Bearer',
        admin,
        usuario,
      });
    }),
    map(() => true),
    catchError(() => of(redirect()))
  );
};
