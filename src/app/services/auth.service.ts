import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _accessToken = signal<string | null>(localStorage.getItem('accessToken'));
  _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  setTokens(accessToken: string, refreshToken?: string | null) {
    this._accessToken.set(accessToken);
    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      this._refreshToken.set(refreshToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      this._refreshToken.set(null);
      localStorage.removeItem('refreshToken');
    }
  }

  setAccessToken(accessToken: string) {
    this._accessToken.set(accessToken);
    localStorage.setItem('accessToken', accessToken);
  }

  clearTokens() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  constructor() {}
}
