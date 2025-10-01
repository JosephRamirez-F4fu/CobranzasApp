import { computed, effect, inject, Injectable } from '@angular/core';
import { InstitutionsService } from '@services/institutions.service';
import { LoginDataService } from '@services/login-data.service';

@Injectable()
export class InstitutionLayoutService {
  private readonly institutionsService = inject(InstitutionsService);
  private readonly loginDataService = inject(LoginDataService);

  readonly institution = computed(() => this.institutionsService.institution());

  constructor() {
    effect(() => {
      if (!this.institutionsService.institution()) {
        this.loginDataService.load();
        const code = this.loginDataService.getInstitutionCode();
        if (code) {
          this.institutionsService.getByCode(code).subscribe();
        }
      }
    });
  }
}
