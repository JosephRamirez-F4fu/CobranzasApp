import { Injectable, signal } from '@angular/core';

@Injectable()
export class AuthNotFoundPageService {
  readonly title = signal('Institución no encontrada');
  readonly description = signal(
    'Verifica el enlace de acceso o contacta con el administrador de tu institución para obtener asistencia.'
  );
}
