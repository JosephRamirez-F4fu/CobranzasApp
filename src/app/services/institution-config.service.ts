import { inject, Injectable, signal } from '@angular/core';
import { InstitutionUpdate } from '@domain/dtos/InstitutionUpdate.dto';
import { InstitutionLDAPSettings } from '@domain/dtos/institutionLDAP.dto';
import { InstitutionNotifications } from '@domain/dtos/institutionNotifications.dto';
import { InstitutionPaymentGateway } from '@domain/dtos/institutionPaymentGateway.dto';
import { Institution } from '@domain/interface/institution';
import { ApiService } from '@shared/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class InstitutionConfigService {
  domain = 'institutions';

  api = inject(ApiService);
  institution = signal<Institution | null>(null);
  notifications = signal<InstitutionNotifications[]>([]);

  setInstitution(updated: Institution) {
    this.institution.set(updated);
  }

  updateBasic(update: InstitutionUpdate) {
    return this.api.put<InstitutionUpdate, Institution>(
      `${this.domain}/basic`,
      update
    );
  }

  updatePaymentGateway(update: InstitutionPaymentGateway, id: number) {
    return this.api.put<InstitutionPaymentGateway, Institution>(
      `${this.domain}/payment-gateway/${id}`,
      update
    );
  }
  updateNotifications(update: InstitutionNotifications, id: number) {
    return this.api.put<InstitutionNotifications, Institution>(
      `${this.domain}/notifications/${id}`,
      update
    );
  }

  loadNotifications() {
    return this.api.get<InstitutionNotifications>(
      `${this.domain}/notifications/` + this.institution()?.id
    );
  }

  addNotification(notification: InstitutionNotifications) {
    return this.api.post(`${this.domain}/notifications`, notification);
  }

  removeNotification(id: number) {
    return this.api.delete(`${this.domain}/notifications/${id}`);
  }

  updateLDAPSettings(update: InstitutionLDAPSettings, id: number) {
    return this.api.put<InstitutionLDAPSettings, Institution>(
      `${this.domain}/ldap-settings/${id}`,
      update
    );
  }
}
