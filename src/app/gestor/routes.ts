import { Routes } from '@angular/router';
import { GestorLayoutComponent } from './layout/gestor.layout';
import { GestorDashboardPageComponent } from './pages/dashboard/gestor-dashboard.page';
import { RegistrarInstitucionPageComponent } from '../auth/pages/registrar-institucion/registrar-institucion.page';
import { gestorGuard } from '../core/auth/guards/gestor.guard';

export const gestorRoutes: Routes = [
  {
    path: '',
    component: GestorLayoutComponent,
    canActivate: [gestorGuard],
    children: [
      {
        path: '',
        component: GestorDashboardPageComponent,
      },
      {
        path: 'registrar',
        component: RegistrarInstitucionPageComponent,
      },
    ],
  },
];

export default gestorRoutes;
