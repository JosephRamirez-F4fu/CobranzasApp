import { LoginService } from '@services/admin-login.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class AdminNavbarComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

  logout() {
    this.loginService.logout().subscribe();
    this.router.navigate(['/admin/login']);
  }
}
