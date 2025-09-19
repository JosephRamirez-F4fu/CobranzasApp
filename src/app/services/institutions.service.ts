import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from 'src/app/shared/api/api.service';
import { Institution } from '@domain/interface/institution';
import { tap } from 'rxjs';

export interface InstitutionForCreate {
  id: number | null;
  email: string;
  phoneNumber: string;
  address: string | null;
  code: string;
  name: string;
}

export interface InstitutionLogin {
  logoUrl: string;
  logoLoginUrl: string;
  code: string;
  name: string;
  id: number;
}

export class InstitutionMapper {
  static forLogin(dto: Institution): InstitutionLogin {
    return {
      logoUrl: dto.logoUrl ?? '',
      logoLoginUrl: dto.logoLoginUrl ?? '',
      code: dto.code,
      name: dto.name,
      id: dto.id,
    };
  }

  static forCreate(dto: Institution): InstitutionForCreate {
    return {
      id: dto.id ?? null,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      address: dto.address ?? null,
      code: dto.code,
      name: dto.name,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  api = inject(ApiService);
  domain = 'institutions';

  institution = signal<Institution | null>(null);

  save(institution: InstitutionForCreate) {
    return this.api.post<InstitutionForCreate, Institution>(
      `${this.domain}`,
      institution
    );
  }

  update(institution: InstitutionForCreate) {
    return this.api.put<InstitutionForCreate, Institution>(
      `${this.domain}/${institution.id}`,
      institution
    );
  }

  delete(id: number) {
    return this.api.delete(`${this.domain}/${id}`);
  }

  getPage(page: number, size: number) {
    return this.api.get<{ items: Institution[]; totalPages: number }>(
      `${this.domain}?page=${page}&size=${size}`
    );
  }

  getByCode(code: string) {
    return this.api
      .get<Institution>(`${this.domain}/code/${code}`)
      .pipe(tap((res) => this.institution.set(res.data)));
  }
}
