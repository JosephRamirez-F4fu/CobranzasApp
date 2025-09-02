import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/api/api.service';
import { LoginDto } from '../interfaces/login.dto';
import { LoginResponseDto } from '../interfaces/login-response.dto';
import { tap } from 'rxjs';

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminLoginService {
  private api = inject(ApiService);
  private domain = 'auth';

  login(credentials: LoginDto) {
    return this.api
      .post<LoginDto, LoginResponseDto>(`${this.domain}/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        })
      );
  }

  logout() {
    return this.api
      .post<RefreshTokenRequest, void>(`${this.domain}/logout`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
      );
  }

  getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || '';
  }
}
