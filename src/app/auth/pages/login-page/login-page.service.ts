import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDto } from '@domain/dtos/login.dto';
import { LoginAttemptResultDto } from '@domain/dtos/login-attempt-result.dto';
import {
  InstitutionLogin,
  InstitutionMapper,
  InstitutionsService,
} from '@services/institutions.service';
import { LoginDataService } from '@services/login-data.service';
import { LoginService } from '@services/admin-login.service';

@Injectable()
export class LoginPageService {
  private readonly institutionsService = inject(InstitutionsService);
  private readonly loginService = inject(LoginService);
  private readonly loginDataService = inject(LoginDataService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly institution = signal<InstitutionLogin | null>(null);
  readonly institutionLoading = signal(false);
  readonly loginLoading = signal(false);
  readonly loginError = signal<string | null>(null);

  initialize() {
    this.loginDataService.clearOtpChallenge();
    this.loginDataService.setPostLoginRedirectUrl(null);

    const code = this.activatedRoute.snapshot.paramMap.get('code')?.trim() ?? '';
    if (!code) {
      void this.router.navigate(['/auth/not-found']);
      this.loginDataService.setInstitutionCode(null);
      this.institution.set(null);
      this.loginDataService.setOtpFallbackUrl('/auth/not-found');
      return;
    }

    this.fetchInstitution(code);
  }

  submitLogin(dto: LoginDto) {
    if (this.loginLoading()) {
      return;
    }

    this.loginLoading.set(true);
    this.loginError.set(null);
    this.loginDataService.setPostLoginRedirectUrl('/institucion');

    this.loginService
      .login({
        ...dto,
        institutionCode: this.loginDataService.getInstitutionCode(),
      })
      .subscribe({
        next: (response) => {
          this.loginLoading.set(false);

          if (!response.status || !response.data) {
            this.loginError.set(
              response.message ||
                'No se pudo iniciar sesión. Verifica tus credenciales.'
            );
            return;
          }

          this.handleLoginResult(response.data);
        },
        error: () => {
          this.loginLoading.set(false);
          this.loginError.set('No se pudo iniciar sesión. Verifica tus credenciales.');
        },
      });
  }

  private handleLoginResult(result: LoginAttemptResultDto) {
    if (result.type === 'otp') {
      void this.router.navigate(['/auth/otp']);
      return;
    }

    if (result.type === 'authenticated') {
      const redirect = this.loginDataService.getPostLoginRedirectUrl() ?? '/institucion';
      this.loginDataService.setPostLoginRedirectUrl(null);
      this.loginDataService.setOtpFallbackUrl(null);
      void this.router.navigateByUrl(redirect);
      return;
    }
  }

  private fetchInstitution(code: string) {
    this.institutionLoading.set(true);
    this.institutionsService.getByCode(code).subscribe({
      next: (institution) => {
        this.institution.set(InstitutionMapper.forLogin(institution.data));
        this.loginDataService.setInstitutionCode(institution.data.code);
        this.loginDataService.setOtpFallbackUrl(
          `/auth/institucion/${institution.data.code}`
        );
        this.institutionLoading.set(false);
      },
      error: () => {
        this.institutionLoading.set(false);
        this.institution.set(null);
        this.loginDataService.setInstitutionCode(null);
        this.loginDataService.setOtpFallbackUrl('/auth/not-found');
        void this.router.navigate(['/auth/not-found']);
      },
    });
  }
}
