import { Component, inject } from '@angular/core';
import { AdminLoginFormComponent } from './components/admin-login-form/admin-login-form.component';
import {
  AdminLoginCredentials,
  AdminLoginPageService,
} from './admin-login-page.service';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [AdminLoginFormComponent],
  templateUrl: './adminLogin.component.html',
  providers: [AdminLoginPageService],
})
export class AdminLoginComponent {
  protected readonly pageService = inject(AdminLoginPageService);

  onSubmit(credentials: AdminLoginCredentials) {
    this.pageService.attemptLogin(credentials);
  }
}
