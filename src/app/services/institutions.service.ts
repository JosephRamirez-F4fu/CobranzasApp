import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';

export interface InstitutionAPI {
  id: number | null;
  email: string;
  phoneNumber: string;
  address: string | null;
  instituionId: string;
  name: string;
}

export interface Institution {
  id: number | null;
  codigo: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string | null;
}

export class InstitutionMapper {
  static toDto(institution: Institution): InstitutionAPI {
    return {
      id: institution.id,
      email: institution.email,
      phoneNumber: institution.telefono,
      address: institution.direccion,
      instituionId: institution.codigo,
      name: institution.nombre,
    };
  }

  static fromDto(dto: InstitutionAPI): Institution {
    return {
      id: dto.id,
      codigo: dto.instituionId,
      email: dto.email,
      telefono: dto.phoneNumber,
      direccion: dto.address,
      nombre: dto.name,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  api = inject(ApiService);
  domain = 'institutions';

  save(institution: Institution) {
    return this.api.post<InstitutionAPI, InstitutionAPI>(
      `${this.domain}`,
      InstitutionMapper.toDto(institution)
    );
  }

  update(institution: Institution) {
    return this.api.put<InstitutionAPI, InstitutionAPI>(
      `${this.domain}/${institution.id}`,
      InstitutionMapper.toDto(institution)
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.domain}/${id}`);
  }

  getPage(page: number, size: number) {
    return this.api.get<{ items: InstitutionAPI[]; totalPages: number }>(
      `${this.domain}?page=${page}&size=${size}`
    );
  }

  getByCode(code: string) {
    return this.api.get<InstitutionAPI>(`${this.domain}/code/${code}`);
  }
}
