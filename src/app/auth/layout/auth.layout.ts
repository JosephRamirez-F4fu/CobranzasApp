import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayoutComponent {
  private router = inject(Router);
  private router_active = inject(Router);
  not_found = effect(() => {
    if (this.router_active.url === '/auth')
      this.router.navigate(['/auth/not-found']);
  });
}
