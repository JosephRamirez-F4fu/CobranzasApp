import { Routes } from '@angular/router';
import { InstitutionLayoutComponent } from './layout/institution.layout';
import { INSTITUTION_SHARED_SERVICES } from './services';

const InstitucionRoutes: Routes = [
  {
    path: '',
    component: InstitutionLayoutComponent,
    providers: [...INSTITUTION_SHARED_SERVICES],
    children: [
      {
        path: 'configuracion',
        data: { title: 'Configuración' },
        children: [
          {
            path: 'perfil',
            data: { title: 'Perfil' },
            loadComponent: () =>
              import(
                './pages/configuration/profileConfig/profileConfig.component'
              ),
          },
          {
            path: 'institucion',
            data: { title: 'Institución' },
            loadComponent: () =>
              import(
                './pages/configuration/institutionConfig/institutionConfig.component'
              ),
          },
          {
            path: 'pasarela-pagos',
            data: { title: 'Pasarela de pagos' },
            loadComponent: () =>
              import(
                './pages/configuration/paymentGatewayConfig/paymentGatewayConfig.component'
              ),
          },
          {
            path: 'notificaciones',
            data: { title: 'Notificaciones' },
            loadComponent: () =>
              import(
                './pages/configuration/notificationsConfig/notificationsConfig.component'
              ),
          },
          {
            path: 'LDAP',
            data: { title: 'LDAP' },
            loadComponent: () =>
              import('./pages/configuration/LDAPConfig/LDAPConfig.component'),
          },
          {
            path: '',
            data: { hideFromNav: true }, // ocultar para evitar duplicado
            redirectTo: 'perfil',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'usuarios',
        data: { title: 'Usuarios' },
        children: [
          {
            path: '',
            data: { title: 'Listado', hideFromNav: true }, // ocultar para evitar duplicado
            loadComponent: () =>
              import('./pages/users/usersShow/usersShow.component'),
          },
          {
            path: 'cuenta',
            data: { title: 'Cuenta', hideFromNav: true }, // ocultar para evitar duplicado
            loadComponent: () =>
              import('./pages/users/userAccount/userAccount.component'),
          },
        ],
      },
      {
        path: 'alumnos',
        data: { title: 'Alumnos' },
        children: [
          {
            path: 'estado-cuenta',
            data: { title: 'Estado de cuenta', queryParams: ['studentId'] },
            loadComponent: () =>
              import('./pages/students/accountStatus/accountStatus.component'),
          },
          {
            path: 'detalle-pagos',
            data: { title: 'Detalle de pagos', queryParams: ['studentId'] },
            loadComponent: () =>
              import(
                './pages/students/paymentDetails/paymentDetails.component'
              ),
          },
          {
            path: 'historial-detalle',
            data: { title: 'Historial de pagos', queryParams: ['studentId'] },
            loadComponent: () =>
              import(
                './pages/students/paymentHistory/paymentHistory.component'
              ),
          },
          {
            path: 'matriculas',
            data: { title: 'Matrículas', queryParams: ['studentId'] },
            loadComponent: () =>
              import(
                './pages/students/studentEnrollments/studentEnrollments.component'
              ),
          },
          {
            path: '',
            data: { title: 'Listado', hideFromNav: true }, // ocultar para evitar duplicado
            loadComponent: () =>
              import('./pages/students/studentsShow/studentsShow.component'),
          },
        ],
      },
      {
        path: 'cronograma-matriculas',
        data: { title: 'Cronograma de matrículas' },
        loadComponent: () =>
          import('./pages/enrollmentSchedule/enrollmentSchedule.component'),
      },
      {
        path: '',
        redirectTo: 'configuracion',
        pathMatch: 'full',
        data: { hideFromNav: true }, // ocultar para evitar duplicado
      },
    ],
  },
];

export default InstitucionRoutes;
