import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './user.service';
import { UsuariosFacade } from '../api/facades/usuarios.facade';
import { map, switchMap } from 'rxjs/operators';
import { ApiResponseUsuarioResponse } from '../api/models/api-response-usuario-response';
import { RegistroRequest } from '../api/models/registro-request';
import { ApiResponseString } from '../api/models/api-response-string';
import { ChangePasswordRequest as ChangePasswordRequestApi } from '../api/models/change-password-request';
import type { ApiResponse } from '../shared/api/api.service';

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  nombreCompleto: string;
  correo: string;
  rol: 'MASTER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  api = inject(UsuariosFacade);
  auth_service = inject(AuthService);
  user = signal<User | null>(null);

  change_password(request: ChangePasswordRequest) {
    return this.api
      .cambiarContrasena({ body: this.mapChangePassword(request) })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }
  updateProfile(data: UpdateProfileRequest) {
    const payload = this.mapUpdateProfile(data);

    return this.api
      .actualizarPerfil({ body: payload })
      .pipe(switchMap(() => this.api.obtenerPerfil()))
      .pipe(map((response) => this.mapUserResponse(response)));
  }
  load() {
    return this.api.obtenerPerfil().pipe(map((response) => this.mapUserResponse(response)));
  }

  private mapChangePassword(
    request: ChangePasswordRequest
  ): ChangePasswordRequestApi {
    return {
      oldPassword: request.oldPassword,
      newPassword: request.newPassword,
      confirmPassword: request.newPassword,
    };
  }

  private mapUpdateProfile(
    data: UpdateProfileRequest
  ): RegistroRequest {
    return {
      nombreCompleto: data.nombreCompleto,
      correo: data.correo,
      rol: data.rol,
      nombreUsuario: data.correo,
    };
  }

  private mapVoidResponse(response: ApiResponseString): ApiResponse<void> {
    return {
      data: undefined,
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapUserResponse(
    response: ApiResponseUsuarioResponse
  ): ApiResponse<User> {
    return {
      data: this.toDomain(response.data),
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private toDomain(dto?: ApiResponseUsuarioResponse['data']): User {
    return {
      id: dto?.id ?? null,
      contrasena: '',
      nombreCompleto: dto?.nombreCompleto ?? '',
      correo: dto?.correo ?? '',
      rol: (dto?.rol as 'MASTER' | 'ADMIN') ?? 'ADMIN',
      institutionId: dto?.institutionId ?? null,
    };
  }
}
