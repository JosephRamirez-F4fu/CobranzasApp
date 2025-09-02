import { Component, inject, signal, effect } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Institution,
  InstitutionMapper,
  InstitutionsService,
} from '../../../services/institutions.service';

export interface InstitutionLogin {
  logoUrl: string;
  logoLoginUrl: string;
  institutionId: string;
  name: string;
}

@Component({
  selector: 'login-page',
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  institution_service = inject(InstitutionsService);
  private route = inject(Router);
  private route_activated = inject(ActivatedRoute);
  code = signal<string>(
    this.route_activated.snapshot.paramMap.get('code') ?? ''
  );
  redirect_to_not_found = effect(() => {
    const c = this.code().trim();
    console.log('Código de institución:', c);
    if (!c) {
      void this.route.navigate(['/auth/not-found']);
      return;
    }
  });
  institution = signal<Institution | null>(null);

  load_institution = effect(() => {
    const c = this.code().trim();
    if (!c) return;

    this.institution_service.getByCode(c).subscribe({
      next: (institution) => {
        this.institution.set(InstitutionMapper.fromDto(institution.data));
      },
      error: () => {
        this.institution.set(null);
      },
    });
  });
}
