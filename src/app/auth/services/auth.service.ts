import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  token = computed(this._token);

  constructor() {}
}
