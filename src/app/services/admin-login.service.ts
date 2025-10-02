import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import type { ApiResponse } from '@shared/api/api.service';
import { LoginDto } from '@domain/dtos/login.dto';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';
import { LoginAttemptResultDto } from '@domain/dtos/login-attempt-result.dto';
import { OtpChallengeDto } from '@domain/dtos/otp-challenge.dto';
import { AuthService } from './auth.service';
import { AutenticacionFacade } from '../api/facades/autenticacion.facade';
import { ApiResponseAccessTokenResponse } from '../api/models/api-response-access-token-response';
import { AccessTokenResponse } from '../api/models/access-token-response';
import { ApiResponseVoid } from '../api/models/api-response-void';
import { ApiResponseOtpChallengeResponse } from '../api/models/api-response-otp-challenge-response';
import { LoginDataService } from './login-data.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = inject(AutenticacionFacade);
  private auth_service = inject(AuthService);
  private loginDataService = inject(LoginDataService);

  login(credentials: LoginDto) {
    return this.api
      .iniciarSesion({
        body: {
          nombreUsuario: credentials.nombreUsuario,
          contrasena: credentials.contrasena,
          institutionCode: credentials.institutionCode ?? undefined,
        },
      })
      .pipe(
        map((response) => this.mapLoginResponse(response)),
        tap((response) => {
          if (!response.status || !response.data) {
            return;
          }

          if (response.data.type === 'authenticated') {
            const { accessToken, refreshToken } = response.data.tokens;
            if (accessToken) {
              if (refreshToken) {
                this.auth_service.setTokens(accessToken, refreshToken);
              } else {
                this.auth_service.setAccessToken(accessToken);
              }
            }
            this.loginDataService.clearOtpChallenge();
          }

          if (response.data.type === 'otp') {
            this.loginDataService.setOtpChallenge(response.data.challenge);
          }
        })
      );
  }

  logout() {
    return this.api.cerrarSesion().pipe(
      map((response) => this.mapVoidResponse(response)),
      tap(() => {
        this.auth_service.clearTokens();
        this.loginDataService.clearOtpChallenge();
      })
    );
  }

  private mapLoginResponse(
    response: ApiResponseOtpChallengeResponse
  ): ApiResponse<LoginAttemptResultDto | null> {
    const message = response.message ?? '';
    const status = response.success ?? false;
    const data = (response as unknown as ApiResponseAccessTokenResponse).data as
      | (AccessTokenResponse & { refreshToken?: string | null })
      | null
      | undefined;

    if (data?.accessToken) {
      return {
        data: {
          type: 'authenticated',
          tokens: {
            accessToken: data.accessToken ?? '',
            refreshToken: data.refreshToken ?? '',
          },
        },
        message,
        status,
      };
    }

    const challenge = response.data;
    if (challenge?.challengeId) {
      const expiresInSeconds =
        typeof challenge.expiresInSeconds === 'number'
          ? challenge.expiresInSeconds
          : null;
      const expiresAt =
        typeof expiresInSeconds === 'number'
          ? Date.now() + expiresInSeconds * 1000
          : null;

      const normalizedChallenge: OtpChallengeDto = {
        challengeId: challenge.challengeId,
        expiresInSeconds,
        expiresAt,
      };

      return {
        data: {
          type: 'otp',
          challenge: normalizedChallenge,
        },
        message,
        status,
      };
    }

    return {
      data: null,
      message,
      status,
    };
  }

  private mapVoidResponse(response: ApiResponseVoid): ApiResponse<void> {
    return {
      data: undefined,
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }
}
