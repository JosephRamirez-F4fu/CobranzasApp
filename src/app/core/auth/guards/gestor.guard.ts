import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../auth.store';
import { AuthApiService } from '../../../auth/data-access/auth.api';
import { catchError, map, of, tap } from 'rxjs';

export const gestorGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const token = store.accessToken();
  const gestor = store.gestor();

  const redirect = () => router.createUrlTree(['/gestor/login']);

  if (!token || !gestor) {
    store.clear();
    return redirect();
  }

  return authApi.fetchCurrentUser().pipe(
    tap(({ usuario, newAccessToken }) => {
      store.setSession({
        accessToken: newAccessToken ?? token,
        tokenType: store.tokenType() ?? 'Bearer',
        admin: store.admin() ?? undefined,
        usuario,
        gestor,
      });
    }),
    map(() => true),
    catchError(() => {
      store.clear();
      return of(redirect());
    })
  );
};
