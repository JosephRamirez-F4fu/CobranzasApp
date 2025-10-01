import { Injectable, signal } from '@angular/core';

interface AdminHomeCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

@Injectable()
export class AdminHomeService {
  readonly title = signal('¡Bienvenido al Panel de Administración!');
  readonly description = signal(
    'Desde aquí puedes gestionar usuarios, instituciones y acceder a todas las funcionalidades administrativas del sistema.'
  );

  readonly cards = signal<AdminHomeCard[]>([
    {
      icon: '👤',
      title: 'Usuarios',
      description: 'Gestiona cuentas y permisos',
    },
    {
      icon: '🏫',
      title: 'Instituciones',
      description: 'Administra datos de instituciones',
    },
    {
      icon: '📊',
      title: 'Reportes',
      description: 'Visualiza estadísticas y reportes',
    },
  ]);
}
