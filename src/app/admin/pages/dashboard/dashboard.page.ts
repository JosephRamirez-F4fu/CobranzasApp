import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
})
export class AdminDashboardPageComponent {
  readonly shortcuts = [
    { title: 'Instituciones', description: 'Administra tus colegios' },
    { title: 'Perfiles', description: 'Gestiona los usuarios y permisos' },
    { title: 'Pagos', description: 'Revisa el estado de cobranzas' },
  ];
}
