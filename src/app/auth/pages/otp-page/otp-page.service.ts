import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { OtpChallengeDto } from '@domain/dtos/otp-challenge.dto';
import { ApiResponse } from '@shared/api/api.service';
import { OtpService } from '@services/otp.service';
import { LoginDataService } from '@services/login-data.service';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';

@Injectable()
export class OtpPageService {
  private readonly otpService = inject(OtpService);
  private readonly loginDataService = inject(LoginDataService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly verifying = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly challenge = signal<OtpChallengeDto | null>(null);

  readonly otpForm = this.fb.group({
    otp: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
  });

  initialize() {
    const currentChallenge = this.otpService.getActiveChallenge();
    if (!currentChallenge) {
      this.redirectToFallback();
      return;
    }

    if (currentChallenge.expiresAt && currentChallenge.expiresAt < Date.now()) {
      this.loginDataService.clearOtpChallenge();
      this.errorMessage.set('El código ha expirado. Inicia sesión nuevamente.');
      this.otpForm.disable();
      return;
    }

    this.challenge.set(currentChallenge);
  }

  submitOtp() {
    if (this.otpForm.disabled) {
      return;
    }

    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid || this.verifying()) {
      return;
    }

    const otp = this.otpForm.value.otp?.trim() ?? '';
    if (!otp) {
      this.errorMessage.set('Ingresa el código de verificación.');
      return;
    }

    this.verifying.set(true);
    this.errorMessage.set(null);

    this.otpService.verifyOtp(otp).subscribe({
      next: (response: ApiResponse<LoginResponseDto>) => {
        this.verifying.set(false);

        if (!response.status) {
          this.errorMessage.set(
            response.message ||
              'No se pudo verificar el código. Inténtalo nuevamente.'
          );
          return;
        }

        this.navigateAfterSuccess();
      },
      error: (error: unknown) => {
        this.verifying.set(false);

        if (error instanceof Error) {
          if (error.message === 'otp_challenge_expired') {
            this.loginDataService.clearOtpChallenge();
            this.errorMessage.set('El código ha expirado. Inicia sesión nuevamente.');
            this.otpForm.disable();
            return;
          }

          if (error.message === 'otp_challenge_not_found') {
            this.redirectToFallback();
            return;
          }
        }

        this.errorMessage.set(
          'No se pudo verificar el código. Inténtalo nuevamente.'
        );
      },
    });
  }

  cancel() {
    this.loginDataService.clearOtpChallenge();
    this.loginDataService.setPostLoginRedirectUrl(null);
    this.redirectToFallback();
  }

  private navigateAfterSuccess() {
    const redirect = this.loginDataService.getPostLoginRedirectUrl() ?? '/';
    this.loginDataService.setPostLoginRedirectUrl(null);
    this.loginDataService.setOtpFallbackUrl(null);
    void this.router.navigateByUrl(redirect);
  }

  private redirectToFallback() {
    const fallback = this.loginDataService.getOtpFallbackUrl() ?? '/auth/not-found';
    void this.router.navigateByUrl(fallback);
  }
}
