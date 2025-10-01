import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services/admin-login.service';

export interface AdminLoginCredentials {
  readonly email: string;
  readonly password: string;
}

@Injectable()
export class AdminLoginPageService {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly success = signal(false);

  attemptLogin(credentials: AdminLoginCredentials) {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    this.loginService
      .login({
        nombreUsuario: credentials.email,
        contrasena: credentials.password,
        institutionCode: null,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
          void this.router.navigate(['/admin']);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Credenciales incorrectas o error de red.');
        },
      });
  }
}
