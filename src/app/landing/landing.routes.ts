import { Routes } from '@angular/router';
import { LandingLayoutComponent } from './layout/landing.layout';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const landingRoutes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default landingRoutes;
