import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/api/api.service';
import { LoginDto } from '../interfaces/login.dto';
import { LoginResponseDto } from '../interfaces/login-response.dto';
import { tap } from 'rxjs';

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
          if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
          }
        })
      );
  }

  logout() {
    return this.api.post<{}, void>(`${this.domain}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
      })
    );
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
}
