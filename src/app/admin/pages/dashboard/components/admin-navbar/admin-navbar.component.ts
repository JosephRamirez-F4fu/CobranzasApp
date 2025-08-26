import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'admin-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
})
export class AdminNavbarComponent {}
