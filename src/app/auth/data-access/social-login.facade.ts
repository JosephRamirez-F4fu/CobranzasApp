import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSsoRequest } from '../../../api/models/login-sso-request';
import { AuthStore } from '../../core/auth/auth.store';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthApiService } from './auth.api';

export type SocialProvider = 'google' | 'outlook';

@Injectable({ providedIn: 'root' })
export class SocialLoginFacade {
  private readonly api = inject(AuthApiService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly status = signal<'idle' | 'loading' | 'error'>('idle');
  readonly errorMessage = signal<string | null>(null);

  login(provider: SocialProvider, email?: string | null) {
    if (!email) {
      const warning = 'Ingresa tu correo institucional antes de continuar.';
      this.errorMessage.set(warning);
      this.notifications.info(warning);
      this.status.set('error');
      return;
    }

    const payload: LoginSsoRequest = {
      email,
      provider,
      nombre: null,
    };

    this.status.set('loading');
    this.errorMessage.set(null);

    this.api.loginSso(payload).subscribe({
      next: (response) => {
        this.store.setSession({
          accessToken: response.access_token,
          tokenType: response.token_type,
          admin: response.admin,
          usuario: response.usuario,
        });
        this.status.set('idle');
        this.notifications.success('Sesión iniciada con tu proveedor');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        const detail =
          error?.error?.detail ??
          error?.message ??
          'No pudimos autenticarte con tu proveedor. Intenta nuevamente.';
        this.errorMessage.set(detail);
        this.notifications.error(detail);
        this.status.set('error');
      },
    });
  }
}
