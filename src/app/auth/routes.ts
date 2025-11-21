import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/admin.layout';
import { LoginPageComponent } from './pages/login/login.page';
import { GestorLoginPageComponent } from './pages/gestor-login/gestor-login.page';
import { RegistrarInstitucionPageComponent } from './pages/registrar-institucion/registrar-institucion.page';
import { ConfirmarAdminPageComponent } from './pages/confirmar-admin/confirmar-admin.page';

export const authRoutes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
      {
        path: 'gestor/login',
        component: GestorLoginPageComponent,
      },
      {
        path: 'confirmar',
        component: ConfirmarAdminPageComponent,
      },
    ],
  },
];

export default authRoutes;
