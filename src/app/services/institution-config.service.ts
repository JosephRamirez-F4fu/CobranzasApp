import { inject, Injectable } from '@angular/core';
import { InstitutionUpdate } from '@domain/dtos/InstitutionUpdate.dto';
import { InstitutionLDAPSettings } from '@domain/dtos/institutionLDAP.dto';
import { Institution } from '@domain/interface/institution';
import { ApiService } from '@shared/api/api.service';
import { InstitutionsService } from './institutions.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitutionConfigService {
  domain = 'institutions';
  instituionService = inject(InstitutionsService);
  api = inject(ApiService);

  updateBasic(update: InstitutionUpdate) {
    return this.api.put<InstitutionUpdate, Institution>(
      `${this.domain}/basic`,
      update
    );
  }

  updateLDAPSettings(update: InstitutionLDAPSettings, id: number) {
    return this.api
      .put<InstitutionLDAPSettings, Institution>(
        `${this.domain}/${id}/ldap`,
        update
      )
      .pipe(map((r) => r.data));
  }
}
