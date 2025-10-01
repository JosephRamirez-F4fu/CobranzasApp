import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstitutionNavbarComponent } from '../components/institutionNavbar/institutionNavbar.component';
import { InstitutionLayoutService } from './institution-layout.service';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, InstitutionNavbarComponent],
  templateUrl: './institution-layout.html',
  providers: [InstitutionLayoutService],
})
export class InstitutionLayoutComponent {
  protected readonly layoutService = inject(InstitutionLayoutService);
}
