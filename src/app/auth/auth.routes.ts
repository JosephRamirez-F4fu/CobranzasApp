import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth.layout';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundComponent } from './pages/not-found-page/not-found.component';
import { OtpPageComponent } from './pages/otp-page/otp-page.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'institucion/:code',
        component: LoginPageComponent,
      },
      {
        path: 'otp',
        component: OtpPageComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];

export default authRoutes;
