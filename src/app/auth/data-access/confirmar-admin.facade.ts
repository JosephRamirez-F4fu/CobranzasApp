import { inject, Injectable, signal } from '@angular/core';
import { ConfirmarInstitucionRequest } from '../../../api/models/confirmar-institucion-request';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthApiService } from './auth.api';

@Injectable({ providedIn: 'root' })
export class ConfirmarAdminFacade {
  private readonly api = inject(AuthApiService);
  private readonly notifications = inject(NotificationService);

  readonly status = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  readonly errorMessage = signal<string | null>(null);

  confirmar(payload: ConfirmarInstitucionRequest) {
    if (this.status() === 'loading') {
      return;
    }
    this.status.set('loading');
    this.errorMessage.set(null);
    this.api.confirmarInstitucion(payload).subscribe({
      next: () => {
        this.status.set('success');
        this.notifications.success('Institución confirmada. Ahora puedes iniciar sesión.');
      },
      error: (error) => {
        const detail =
          error?.error?.detail ??
          error?.message ??
          'No pudimos confirmar la institución. Revisa los tokens.';
        this.errorMessage.set(detail);
        this.notifications.error(detail);
        this.status.set('error');
      },
    });
  }
}
