import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { map, Observable } from 'rxjs';

export enum MedioEnvio {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  IVR = 'IVR',
}

export interface NotificacionConfigRegister {
  medioEnvio: MedioEnvio;
  frecuencia: string;
  diadDelMes: number;
  horaEnvio: string;
  activo: boolean;
  mensaje: string;
  asunto: string;
  institutionCode: string;
}

export interface NotificacionConfigResponse {
  medioEnvio: MedioEnvio;
  frecuencia: string;
  diadDelMes: number;
  horaEnvio: string;
  activo: boolean;
  mensaje: string;
  asunto: string;
  id: number;
  institutionCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigService {
  private api = inject(ApiService);
  private readonly base = 'notificacion-configuracion';

  registrar(
    data: NotificacionConfigRegister
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .post<NotificacionConfigRegister, NotificacionConfigResponse>(
        `${this.base}`,
        data
      )
      .pipe(map((r) => r.data));
  }

  obtener(
    code: string,
    medio: MedioEnvio
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .get<NotificacionConfigResponse>(
        `${this.base}/institucion/${encodeURIComponent(
          code
        )}/medio/${encodeURIComponent(medio)}`
      )
      .pipe(map((r) => r.data));
  }

  existe(code: string, medio: MedioEnvio): Observable<boolean> {
    return this.api
      .get<boolean>(
        `${this.base}/existe/${encodeURIComponent(
          code
        )}/medio/${encodeURIComponent(medio)}`
      )
      .pipe(map((r) => r.data));
  }

  editar(
    code: string,
    medio: MedioEnvio,
    data: NotificacionConfigRegister
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .put<NotificacionConfigRegister, NotificacionConfigResponse>(
        `${this.base}/${encodeURIComponent(code)}/medio/${encodeURIComponent(
          medio
        )}`,
        data
      )
      .pipe(map((r) => r.data));
  }
}
