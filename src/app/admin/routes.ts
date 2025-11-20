import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin.layout';
import { AdminDashboardPageComponent } from './pages/dashboard/dashboard.page';
import { adminGuard } from '../core/auth/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardPageComponent,
      },
    ],
  },
];

export default adminRoutes;
