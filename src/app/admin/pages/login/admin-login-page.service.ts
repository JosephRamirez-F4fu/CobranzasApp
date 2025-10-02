import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAttemptResultDto } from '@domain/dtos/login-attempt-result.dto';
import { LoginService } from '@services/admin-login.service';
import { LoginDataService } from '@services/login-data.service';

export interface AdminLoginCredentials {
  readonly email: string;
  readonly password: string;
}

@Injectable()
export class AdminLoginPageService {
  private readonly loginService = inject(LoginService);
  private readonly loginDataService = inject(LoginDataService);
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
    this.loginDataService.clearOtpChallenge();
    this.loginDataService.setPostLoginRedirectUrl('/admin');
    this.loginDataService.setOtpFallbackUrl('/admin/login');

    this.loginService
      .login({
        nombreUsuario: credentials.email,
        contrasena: credentials.password,
        institutionCode: null,
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);

          if (!response.status || !response.data) {
            this.errorMessage.set(
              response.message ||
                'Credenciales incorrectas o error de red.'
            );
            return;
          }

          this.handleLoginResult(response.data);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Credenciales incorrectas o error de red.');
        },
      });
  }

  private handleLoginResult(result: LoginAttemptResultDto) {
    if (result.type === 'otp') {
      void this.router.navigate(['/auth/otp']);
      return;
    }

    if (result.type === 'authenticated') {
      this.success.set(true);
      const redirect = this.loginDataService.getPostLoginRedirectUrl() ?? '/admin';
      this.loginDataService.setPostLoginRedirectUrl(null);
      this.loginDataService.setOtpFallbackUrl(null);
      void this.router.navigateByUrl(redirect);
    }
  }
}
