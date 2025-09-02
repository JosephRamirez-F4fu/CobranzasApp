import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _accessToken = signal<string | null>(
    localStorage.getItem('accessToken')
  );
  private _refreshToken = signal<string | null>(
    localStorage.getItem('refreshToken')
  );
  accessToken = computed(this._accessToken);
  refreshToken = computed(this._refreshToken);

  constructor() {}
}
