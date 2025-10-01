import { inject, Injectable } from '@angular/core';
import { InstitutionUpdate } from '@domain/dtos/InstitutionUpdate.dto';
import { InstitutionLDAPSettings } from '@domain/dtos/institutionLDAP.dto';
import { Institution } from '@domain/interface/institution';
import type { ApiResponse } from '@shared/api/api.service';
import { InstitutionsService } from './institutions.service';
import { map } from 'rxjs/operators';
import { InstitucionesFacade } from '../api/facades/instituciones.facade';
import { InstitutionRequestRegister } from '../api/models/institution-request-register';
import { ApiResponseInstitutionResponse } from '../api/models/api-response-institution-response';
import { InstitutionResponse } from '../api/models/institution-response';
import { InstitutionUpdateLdpa } from '../api/models/institution-update-ldpa';

@Injectable({
  providedIn: 'root',
})
export class InstitutionConfigService {
  instituionService = inject(InstitutionsService);
  api = inject(InstitucionesFacade);

  updateBasic(update: InstitutionUpdate) {
    const current = this.instituionService.institution();
    if (!current) {
      throw new Error('No institution selected');
    }

    const body = this.mapToRegisterPayload(update, current.code);

    return this.api
      .actualizar({ id: current.id, body })
      .pipe(map((response) => this.mapInstitutionResponse(response)));
  }

  updateLDAPSettings(update: InstitutionLDAPSettings, id: number) {
    return this.api
      .actualizarLdap({
        id,
        body: this.mapToLdapPayload(update),
      })
      .pipe(map((response) => this.mapInstitutionResponse(response).data));
  }

  private mapToRegisterPayload(
    update: InstitutionUpdate,
    code: string
  ): InstitutionRequestRegister {
    const payload: InstitutionRequestRegister & {
      logoUrl?: string;
      logoLoginUrl?: string;
    } = {
      address: update.address,
      code,
      email: update.email,
      name: update.name,
      phoneNumber: update.phoneNumber,
      logoUrl: update.logoUrl,
      logoLoginUrl: update.logoLoginUrl,
    };

    return payload;
  }

  private mapToLdapPayload(
    update: InstitutionLDAPSettings
  ): InstitutionUpdateLdpa {
    return {
      ldapBaseDn: update.ldapBaseDn,
      ldapHost: update.ldapHost,
      ldapPassword: update.ldapPassword,
      ldapPort: update.ldapPort,
      ldapUserDn: update.ldapUserDn,
      useLdap: update.useLdap,
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
