import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/admin.layout';
import { LoginPageComponent } from './pages/login/login.page';

export const authRoutes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
    ],
  },
];

export default authRoutes;
