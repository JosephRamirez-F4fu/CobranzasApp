import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from '@services/account.service';
import { InstitutionsService } from '@services/institutions.service';
import { LoginDataService } from '@services/login-data.service';
import { InstitutionNavbarComponent } from '../components/institutionNavbar/institutionNavbar.component';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, InstitutionNavbarComponent],
  templateUrl: './institution-layout.html',
})
export class InstitutionLayoutComponent {
  user_service = inject(AccountService);
  instituion_service = inject(InstitutionsService);
  login_data_service = inject(LoginDataService);
  load_institution = effect(() => {
    if (!this.instituion_service.institution()) {
      this.login_data_service.load();
      const code = this.login_data_service.getInstitutionCode();
      if (code) {
        this.instituion_service.getByCode(code).subscribe();
      }
    }
  });
}
