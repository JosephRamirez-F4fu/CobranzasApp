import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInstitucionAdminRequest } from '../../../api/models/login-institucion-admin-request';
import { AuthStore } from '../../core/auth/auth.store';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthApiService } from './auth.api';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  private readonly api = inject(AuthApiService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly status = signal<'idle' | 'loading' | 'error'>('idle');
  readonly errorMessage = signal<string | null>(null);

  login(credentials: LoginInstitucionAdminRequest) {
    if (this.status() === 'loading') {
      return;
    }

    this.status.set('loading');
    this.errorMessage.set(null);

    this.api.loginAdmin(credentials).subscribe({
      next: (response) => {
        this.store.setSession({
          accessToken: response.access_token,
          tokenType: response.token_type,
          admin: response.admin,
          usuario: response.usuario,
        });

        this.status.set('idle');
        this.notifications.success('Sesión iniciada correctamente');
        this.router.navigate(['/admin']);
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
