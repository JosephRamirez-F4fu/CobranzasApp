import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { OtpFacade } from '../api/facades/otp.facade';
import { ApiResponseAccessTokenResponse } from '../api/models/api-response-access-token-response';
import { AccessTokenResponse } from '../api/models/access-token-response';
import { OtpVerificationRequest } from '../api/models/otp-verification-request';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';
import { OtpChallengeDto } from '@domain/dtos/otp-challenge.dto';
import { ApiResponse } from '@shared/api/api.service';
import { AuthService } from './auth.service';
import { LoginDataService } from './login-data.service';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private readonly otpFacade = inject(OtpFacade);
  private readonly authService = inject(AuthService);
  private readonly loginDataService = inject(LoginDataService);

  getActiveChallenge(): OtpChallengeDto | null {
    return this.loginDataService.getOtpChallenge();
  }

  verifyOtp(otp: string): Observable<ApiResponse<LoginResponseDto>> {
    const challenge = this.loginDataService.getOtpChallenge();
    if (!challenge?.challengeId) {
      return throwError(() => new Error('otp_challenge_not_found'));
    }

    if (challenge.expiresAt && challenge.expiresAt < Date.now()) {
      this.loginDataService.clearOtpChallenge();
      return throwError(() => new Error('otp_challenge_expired'));
    }

    const request: OtpVerificationRequest = {
      challengeId: challenge.challengeId,
      otp,
    };

    return this.otpFacade.verificarCodigo({ body: request }).pipe(
      map((response) => this.mapOtpResponse(response)),
      tap((response) => {
        if (response.status) {
          this.handleSuccessfulVerification(response.data);
        }
      })
    );
  }

  private handleSuccessfulVerification(tokens: LoginResponseDto) {
    const { accessToken, refreshToken } = tokens;
    if (accessToken) {
      if (refreshToken) {
        this.authService.setTokens(accessToken, refreshToken);
      } else {
        this.authService.setAccessToken(accessToken);
      }
    }

    this.loginDataService.clearOtpChallenge();
  }

  private mapOtpResponse(
    response: ApiResponseAccessTokenResponse
  ): ApiResponse<LoginResponseDto> {
    const data = response.data as
      | (AccessTokenResponse & { refreshToken?: string | null })
      | null
      | undefined;

    return {
      data: {
        accessToken: data?.accessToken ?? '',
        refreshToken: data?.refreshToken ?? '',
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }
}
