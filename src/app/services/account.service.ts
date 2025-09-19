import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../shared/api/api.service';
import { AuthService } from './auth.service';
import { User } from './user.service';

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  nombreCompleto: string;
  correo: string;
  rol: 'MASTER' | 'ADMIN';
  nombreUsuario: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  domain = 'usuario';
  api = inject(ApiService);
  auth_service = inject(AuthService);
  user = signal<User | null>(null);

  change_password(request: ChangePasswordRequest) {
    return this.api.post<ChangePasswordRequest, User>(
      `${this.domain}/cambiar-contrasena`,
      request
    );
  }
  updateProfile(data: UpdateProfileRequest) {
    return this.api.put<UpdateProfileRequest, User>(
      `${this.domain}/perfil`,
      data
    );
  }
  load() {
    return this.api.get<User>(`${this.domain}/perfil`);
  }
}
