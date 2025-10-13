import { inject, Injectable } from '@angular/core';
import { UsuariosFacade } from '../../api/facades/usuarios.facade';
import { ApiResponse } from '../../shared/api/api.service';
import { ApiResponsePageUsuarioResponse } from '../../api/models/api-response-page-usuario-response';
import { ApiResponseUsuarioResponse } from '../../api/models/api-response-usuario-response';
import { ApiResponseString } from '../../api/models/api-response-string';
import { ApiResponseVoid } from '../../api/models/api-response-void';
import { UsuarioResponse } from '../../api/models/usuario-response';
import { RegistroRequest } from '../../api/models/registro-request';
import { map, switchMap } from 'rxjs/operators';

export interface InstitutionUser {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: 'ADMIN';
  activo: boolean;
  institutionId: number | null;
}

export interface InstitutionUserPayload {
  nombreCompleto: string;
  correo: string;
  contrasena?: string;
  institutionId?: number | null;
}

export interface InstitutionUserPage {
  items: InstitutionUser[];
  totalItems: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionUsersService {
  private readonly api = inject(UsuariosFacade);

  list(page: number, size: number) {
    return this.api
      .listar({
        page,
        size,
        rol: 'ADMIN',
      })
      .pipe(map((response) => this.mapPageResponse(response)));
  }

  findById(id: number) {
    return this.api
      .obtenerPorId({ id })
      .pipe(map((response) => this.mapUserResponse(response)));
  }

  create(payload: InstitutionUserPayload) {
    return this.api
      .registrar({ body: this.mapToRequest(payload) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  update(id: number, payload: InstitutionUserPayload) {
    return this.api
      .actualizarPerfil({ body: this.mapToRequest(payload) })
      .pipe(
        switchMap(() => this.api.actualizarRol({ id, nuevoRol: 'ADMIN' })),
        map((response) => this.mapStringResponse(response))
      );
  }

  deactivate(id: number) {
    return this.api
      .desactivar({ id })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  remove(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  private mapPageResponse(
    response: ApiResponsePageUsuarioResponse
  ): ApiResponse<InstitutionUserPage> {
    const content = response.data?.content ?? [];

    return {
      data: {
        items: content
          .filter((user) => user.rol === 'ADMIN')
          .map((user) => this.mapToDomain(user)),
        totalItems: response.data?.totalElements ?? content.length,
        totalPages: response.data?.totalPages ?? 0,
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapUserResponse(
    response: ApiResponseUsuarioResponse
  ): ApiResponse<InstitutionUser> {
    return {
      data: this.mapToDomain(response.data),
      message: response.message ?? '',
      status: response.success ?? false,
    };
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

  private mapToDomain(dto?: UsuarioResponse | null): InstitutionUser {
    return {
      id: dto?.id ?? 0,
      nombreCompleto: dto?.nombreCompleto ?? '',
      correo: dto?.correo ?? '',
      rol: 'ADMIN',
      activo: dto?.activo ?? false,
      institutionId: dto?.institutionId ?? null,
    };
  }

  private mapToRequest(payload: InstitutionUserPayload): RegistroRequest {
    return {
      nombreCompleto: payload.nombreCompleto,
      correo: payload.correo,
      nombreUsuario: payload.correo,
      contrasena: payload.contrasena || undefined,
      institutionId: payload.institutionId ?? undefined,
      rol: 'ADMIN',
    };
  }
}
