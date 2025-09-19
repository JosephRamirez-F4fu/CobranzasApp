import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDto } from '@domain/dtos/login.dto';
import {
  InstitutionLogin,
  InstitutionMapper,
  InstitutionsService,
} from '@services/institutions.service';
import { LoginDataService } from '@services/login-data.service';
import { InstitutionInfoComponent } from './components/InstitutionInfo/InstitutionInfo.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

import { LoginService } from '@services/admin-login.service';

@Component({
  selector: 'login-page',
  imports: [LoginFormComponent, InstitutionInfoComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  institution_data = inject(LoginDataService);
  institution_service = inject(InstitutionsService);
  login_service = inject(LoginService);

  institution = signal<InstitutionLogin | null>(null);

  private route = inject(Router);
  private route_activated = inject(ActivatedRoute);
  code = signal<string>(
    this.route_activated.snapshot.paramMap.get('code') ?? ''
  );
  redirect_to_not_found = effect(() => {
    const c = this.code().trim();
    if (!c) {
      void this.route.navigate(['/auth/not-found']);
      this.institution.set(null);
      this.institution_data.setInstitutionCode(null);
      return;
    }
  });

  load_institution = effect(() => {
    const c = this.code().trim();
    if (!c) return;

    this.institution_service.getByCode(c).subscribe({
      next: (institution) => {
        this.institution.set(InstitutionMapper.forLogin(institution.data));
        this.institution_data.setInstitutionCode(institution.data.code);
      },
      error: () => {
        this.route.navigate(['/auth/not-found']);
        this.institution.set(null);
        this.institution_data.setInstitutionCode(null);
      },
    });
  });

  onLoginOutput($event: LoginDto) {
    this.login_service
      .login({
        ...$event,
        institutionCode: this.institution_data.getInstitutionCode(),
      })
      .subscribe({
        next: (response) => {
          void this.route.navigate(['/institucion']);
        },
        error: (err) => {
          // manejar error
          console.error(err);
        },
      });
  }
}
