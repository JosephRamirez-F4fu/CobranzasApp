import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout.component';

const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'instituciones',
        loadComponent: () =>
          import('./pages/institutions/institutions.component'),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/users-clients/users-clients.component'),
      },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/home/admin-home.component'),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default adminDashboardRoutes;
