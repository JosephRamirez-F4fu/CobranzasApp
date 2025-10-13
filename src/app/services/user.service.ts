import { inject, Injectable } from '@angular/core';
import type { ApiResponse } from '@shared/api/api.service';
import { map } from 'rxjs/operators';
import { UsuariosFacade } from '../api/facades/usuarios.facade';
import { ApiResponsePageUsuarioResponse } from '../api/models/api-response-page-usuario-response';
import { ApiResponseString } from '../api/models/api-response-string';
import { ApiResponseVoid } from '../api/models/api-response-void';
import { RegistroRequest } from '../api/models/registro-request';
import { UsuarioResponse } from '../api/models/usuario-response';

export interface User {
  id: number | null;
  contrasena: string;
  nombreCompleto: string;
  correo: string;
  rol: 'MASTER' | 'ADMIN';
  institutionId: number | null;
}

export class UserMapper {
  static toRegisterRequest(user: User): RegistroRequest {
    return {
      contrasena: user.contrasena || undefined,
      nombreCompleto: user.nombreCompleto,
      correo: user.correo,
      rol: user.rol,
      nombreUsuario: user.correo,
      institutionId: user.institutionId ?? undefined,
    };
  }

  static fromApi(dto?: UsuarioResponse | null): User {
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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly api = inject(UsuariosFacade);

  save(user: User) {
    return this.api
      .registrar({ body: UserMapper.toRegisterRequest(user) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  update(user: User) {
    return this.api
      .actualizarPerfil({ body: UserMapper.toRegisterRequest(user) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  delete(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  getPage(page: number, size: number) {
    return this.api
      .listar({ page, size })
      .pipe(map((response) => this.mapPageResponse(response)));
  }

  private mapStringResponse(response: ApiResponseString): ApiResponse<void> {
    return {
      data: undefined,
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

  private mapPageResponse(
    response: ApiResponsePageUsuarioResponse
  ): ApiResponse<{ items: User[]; totalPages: number }> {
    const content = response.data?.content ?? [];

    return {
      data: {
        items: content.map((user) => UserMapper.fromApi(user)),
        totalPages: response.data?.totalPages ?? 0,
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }
}
