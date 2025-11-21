import { inject, Injectable, signal } from '@angular/core';
import { RegistroInstitucionRequest } from '../../../api/models/registro-institucion-request';
import { NotificationService } from '../../shared/notifications/notification.service';
import { GestorLoginFacade } from './gestor-login.facade';
import { AuthApiService } from './auth.api';

@Injectable({ providedIn: 'root' })
export class RegistrarInstitucionFacade {
  private readonly api = inject(AuthApiService);
  private readonly notifications = inject(NotificationService);
  private readonly statusSignal = signal<'idle' | 'loading' | 'error' | 'success'>(
    'idle'
  );
  readonly status = this.statusSignal.asReadonly();
  readonly errorMessage = signal<string | null>(null);

  registrar(payload: RegistroInstitucionRequest) {
    if (this.statusSignal() === 'loading') {
      return;
    }
    this.statusSignal.set('loading');
    this.errorMessage.set(null);
    this.api.registrarInstitucionConGestor(payload).subscribe({
      next: (response) => {
        this.statusSignal.set('success');
        this.notifications.success(
          `Institución registrada. Admin (${response.admin_email}) debe confirmar su cuenta.`
        );
      },
      error: (error) => {
        const detail =
          error?.error?.detail ??
          error?.message ??
          'No pudimos registrar la institución. Intenta nuevamente.';
        this.errorMessage.set(detail);
        this.notifications.error(detail);
        this.statusSignal.set('error');
      },
    });
  }
}
