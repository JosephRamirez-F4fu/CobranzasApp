import { AdminLoginService } from '@admin/pages/login/services/admin-login.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
})
export class AdminNavbarComponent {
  private loginService = inject(AdminLoginService);
  private router = inject(Router);

  logout() {
    this.loginService.logout().subscribe();
    this.router.navigate(['/admin/login']);
  }
}
