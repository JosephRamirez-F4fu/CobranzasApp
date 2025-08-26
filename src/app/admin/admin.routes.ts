import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminLoginComponent } from './pages/login/adminLogin.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'login',
        component: AdminLoginComponent,
      },
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/admin-dashboard.routes'),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default adminRoutes;
