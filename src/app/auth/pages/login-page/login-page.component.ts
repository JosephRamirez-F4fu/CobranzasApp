import { Component, inject, signal, effect } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InstitutionLogin,
  InstitutionMapper,
  InstitutionsService,
} from '../../../services/institutions.service';

@Component({
  selector: 'login-page',
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  institution_service = inject(InstitutionsService);
  institution = signal<InstitutionLogin | null>(null);
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

  load_institution = effect(() => {
    const c = this.code().trim();
    if (!c) return;

    this.institution_service.getByCode(c).subscribe({
      next: (institution) => {
        this.institution.set(InstitutionMapper.forLogin(institution.data));
      },
      error: () => {
        this.route.navigate(['/auth/not-found']);
        this.institution.set(null);
      },
    });
  });
}
