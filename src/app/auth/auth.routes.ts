import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth.layout';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

export default authRoutes;
