import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import type { ApiResponse } from '@shared/api/api.service';
import { LoginDto } from '@domain/dtos/login.dto';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';
import { AuthService } from './auth.service';
import { AutenticacionFacade } from '../api/facades/autenticacion.facade';
import { ApiResponseAccessTokenResponse } from '../api/models/api-response-access-token-response';
import { AccessTokenResponse } from '../api/models/access-token-response';
import { ApiResponseVoid } from '../api/models/api-response-void';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = inject(AutenticacionFacade);
  private auth_service = inject(AuthService);

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
          const { accessToken, refreshToken } = response.data;
          if (accessToken) {
            if (refreshToken) {
              this.auth_service.setTokens(accessToken, refreshToken);
            } else {
              this.auth_service.setAccessToken(accessToken);
            }
          }
        })
      );
  }

  logout() {
    return this.api
      .cerrarSesion()
      .pipe(
        map((response) => this.mapVoidResponse(response)),
        tap(() => {
          this.auth_service.clearTokens();
        })
      );
  }

  private mapLoginResponse(
    response: ApiResponseAccessTokenResponse
  ): ApiResponse<LoginResponseDto> {
    const data = response.data as (AccessTokenResponse & {
      refreshToken?: string | null;
    }) | null | undefined;

    return {
      data: {
        accessToken: data?.accessToken ?? '',
        refreshToken: data?.refreshToken ?? '',
      },
      message: response.message ?? '',
      status: response.success ?? false,
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
