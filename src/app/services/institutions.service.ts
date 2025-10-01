import { inject, Injectable, signal } from '@angular/core';
import type { ApiResponse } from 'src/app/shared/api/api.service';
import { Institution } from '@domain/interface/institution';
import { map, tap } from 'rxjs/operators';
import { InstitucionesFacade } from '../api/facades/instituciones.facade';
import { ApiResponseInstitutionResponse } from '../api/models/api-response-institution-response';
import { ApiResponsePageInstitutionResponse } from '../api/models/api-response-page-institution-response';
import { InstitutionRequestRegister } from '../api/models/institution-request-register';
import { InstitutionResponse } from '../api/models/institution-response';
import { ApiResponseVoid } from '../api/models/api-response-void';

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
  api = inject(InstitucionesFacade);

  institution = signal<Institution | null>(null);

  constructor() {}

  save(institution: InstitutionForCreate) {
    return this.api
      .registrar({ body: this.mapToRegisterRequest(institution) })
      .pipe(map((response) => this.mapInstitutionResponse(response)));
  }

  update(institution: InstitutionForCreate) {
    if (institution.id == null) {
      throw new Error('Institution id is required to update');
    }

    return this.api
      .actualizar({
        id: institution.id,
        body: this.mapToRegisterRequest(institution),
      })
      .pipe(map((response) => this.mapInstitutionResponse(response)));
  }

  delete(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  getPage(page: number, size: number) {
    return this.api
      .listar({ page, size })
      .pipe(map((response) => this.mapPagedResponse(response)));
  }

  getByCode(code: string) {
    return this.api
      .obtenerPorCodigo({ institutionCode: code })
      .pipe(
        map((response) => this.mapInstitutionResponse(response)),
        tap((res) => this.institution.set(res.data))
      );
  }

  private mapToRegisterRequest(
    institution: InstitutionForCreate
  ): InstitutionRequestRegister {
    return {
      address: institution.address ?? undefined,
      code: institution.code,
      email: institution.email,
      name: institution.name,
      phoneNumber: institution.phoneNumber,
    };
  }

  private mapInstitutionResponse(
    response: ApiResponseInstitutionResponse
  ): ApiResponse<Institution> {
    return {
      data: this.toDomain(response.data),
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapPagedResponse(
    response: ApiResponsePageInstitutionResponse
  ): ApiResponse<{ items: Institution[]; totalPages: number }> {
    const content = response.data?.content ?? [];
    return {
      data: {
        items: content.map((institution) => this.toDomain(institution)),
        totalPages: response.data?.totalPages ?? 0,
      },
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

  private toDomain(dto?: InstitutionResponse | null): Institution {
    return {
      id: dto?.id ?? 0,
      ldapHost: dto?.ldapHost ?? '',
      ldapPort: dto?.ldapPort ?? '',
      ldapBaseDn: dto?.ldapBaseDn ?? '',
      ldapUserDn: dto?.ldapUserDn ?? '',
      ldapPassword: '',
      useLdap: dto?.useLdap ?? false,
      name: dto?.name ?? '',
      email: dto?.email ?? '',
      phoneNumber: dto?.phoneNumber ?? '',
      address: dto?.address ?? '',
      logoUrl: dto?.logoUrl ?? '',
      logoLoginUrl: dto?.logoLoginUrl ?? '',
      code: dto?.code ?? '',
    };
  }
}
