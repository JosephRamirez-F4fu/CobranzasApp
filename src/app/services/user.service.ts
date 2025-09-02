import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';

export interface UserAPI {
  nombreUsuario: string;
  nombreCompleto: string;
  correo: string;
  institucionId: number | null;
  rol: 'MASTER' | 'ADMIN';
  activo: boolean;
  id: number | null;
}

export interface User {
  id: number | null;
  contrasena: string;
  nombreCompleto: string;
  correo: string;
  rol: 'MASTER' | 'ADMIN';
  institutionId: number | null;
  nombreUsuario: string;
}

export class UserMapper {
  static toDto(institution: User): UserAPI {
    return {
      id: institution.id || null,
      nombreCompleto: institution.nombreCompleto,
      correo: institution.correo,
      rol: institution.rol,
      institucionId: institution.institutionId,
      nombreUsuario: institution.nombreUsuario,
      activo: true,
    };
  }

  static fromDto(dto: UserAPI): User {
    return {
      id: dto.id,
      contrasena: '',
      nombreCompleto: dto.nombreCompleto,
      correo: dto.correo,
      rol: dto.rol,
      institutionId: dto.institucionId,
      nombreUsuario: dto.nombreUsuario,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = inject(ApiService);
  domain = 'usuario';

  save(user: User) {
    return this.api.post<User, UserAPI>(`${this.domain}`, user);
  }

  update(user: User) {
    return this.api.put<UserAPI, UserAPI>(
      `${this.domain}/${user.id}`,
      UserMapper.toDto(user)
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.domain}/${id}`);
  }

  getPage(page: number, size: number) {
    return this.api.get<{ items: UserAPI[]; totalPages: number }>(
      `${this.domain}?page=${page}&size=${size}`
    );
  }
}
