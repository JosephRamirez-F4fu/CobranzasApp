import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { LoginDto } from '@domain/dtos/login.dto';
import { LoginResponseDto } from '@domain/dtos/login-response.dto';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private domain = 'auth';
  private api = inject(ApiService);
  private auth_service = inject(AuthService);

  login(credentials: LoginDto) {
    return this.api
      .post<LoginDto, LoginResponseDto>(`${this.domain}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.data.accessToken && response.data.refreshToken) {
            this.auth_service.setTokens(
              response.data.accessToken,
              response.data.refreshToken
            );
          }
        })
      );
  }

  logout() {
    return this.api
      .post<RefreshTokenRequest, void>(`${this.domain}/logout`, {
        refreshToken: this.auth_service._refreshToken()!,
      })
      .pipe(
        tap(() => {
          this.auth_service.clearTokens();
        })
      );
  }
}
