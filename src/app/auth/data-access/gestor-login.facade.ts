import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { NotificationService } from '../../shared/notifications/notification.service';
import {
  AuthApiService,
  GestorLoginRequest,
} from './auth.api';

@Injectable({ providedIn: 'root' })
export class GestorLoginFacade {
  private readonly api = inject(AuthApiService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly status = signal<'idle' | 'loading' | 'error'>('idle');
  readonly errorMessage = signal<string | null>(null);

  login(credentials: GestorLoginRequest) {
    if (this.status() === 'loading') {
      return;
    }

    this.status.set('loading');
    this.errorMessage.set(null);

    this.api.loginGestor(credentials).subscribe({
      next: (response) => {
        this.store.setSession({
          accessToken: response.access_token,
          tokenType: response.token_type,
          gestor: response.gestor ?? null,
        });

        this.status.set('idle');
        this.notifications.success('Bienvenido al panel de gestores');
        this.router.navigate(['/gestor']);
      },
      error: (error) => {
        const detail =
          error?.error?.detail ??
          error?.message ??
          'No pudimos iniciar sesión. Intenta nuevamente.';
        this.errorMessage.set(detail);
        this.notifications.error(detail);
        this.status.set('error');
      },
    });
  }
}
