import { computed, effect, inject, Injectable } from '@angular/core';
import { InstitutionsService } from '@services/institutions.service';
import { LoginDataService } from '@services/login-data.service';
import { AccountService } from '@services/account.service';
import { take } from 'rxjs/operators';

@Injectable()
export class InstitutionLayoutService {
  private readonly institutionsService = inject(InstitutionsService);
  private readonly loginDataService = inject(LoginDataService);
  private readonly accountService = inject(AccountService);

  readonly institution = computed(() => this.institutionsService.institution());
  readonly user = computed(() => this.accountService.user());

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

    if (!this.accountService.user()) {
      this.accountService
        .load()
        .pipe(take(1))
        .subscribe((res) => this.accountService.user.set(res.data));
    }
  }
}
