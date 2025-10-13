import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MEDIOS_ENVIO, MedioEnvio } from '@domain/enums/type-send';
import { ConfiguracionDeNotificacionesFacade } from '../api/facades/configuracion-de-notificaciones.facade';
import { NotificacionConfigracionRegister } from '../api/models/notificacion-configracion-register';
import { ApiResponseNotificacionConfigracionResponse } from '../api/models/api-response-notificacion-configracion-response';
import { ApiResponseBoolean } from '../api/models/api-response-boolean';
import { NotificacionConfigracionResponse } from '../api/models/notificacion-configracion-response';
import { NotificationScenarioSummary } from '../api/models/notification-scenario-summary';

export { MEDIOS_ENVIO, type MedioEnvio };

export interface NotificacionConfigRegister {
  medioEnvio: MedioEnvio;
  frecuencia: string;
  diadDelMes: number;
  horaEnvio: string;
  activo: boolean;
  mensaje: string;
  asunto: string;
  institutionCode: string;
  notificationScenarioId?: number | null;
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
  notificationScenarioId: number | null;
  notificationScenario?: NotificationScenarioSummary | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigService {
  private api = inject(ConfiguracionDeNotificacionesFacade);

  registrar(
    data: NotificacionConfigRegister
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .registrar({ body: this.mapToRegister(data) })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  obtener(
    code: string,
    medio: MedioEnvio
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .obtenerPorMedio({ code, medioEnvio: medio })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  existe(code: string, medio: MedioEnvio): Observable<boolean> {
    return this.api
      .verificarExistencia({ code, medioEnvio: medio })
      .pipe(map((response) => this.mapBoolean(response)));
  }

  editar(
    code: string,
    medio: MedioEnvio,
    data: NotificacionConfigRegister
  ): Observable<NotificacionConfigResponse> {
    return this.api
      .actualizar({ code, medioEnvio: medio, body: this.mapToRegister(data) })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  private mapToRegister(
    data: NotificacionConfigRegister
  ): NotificacionConfigracionRegister {
    return {
      activo: data.activo,
      asunto: data.asunto,
      diadDelMes: data.diadDelMes,
      frecuencia: data.frecuencia,
      horaEnvio: data.horaEnvio,
      institutionCode: data.institutionCode,
      medioEnvio: data.medioEnvio,
      mensaje: data.mensaje,
      notificationScenarioId: data.notificationScenarioId ?? undefined,
    };
  }

  private mapResponse(response: ApiResponseNotificacionConfigracionResponse): {
    data: NotificacionConfigResponse;
    message: string;
    status: boolean;
  } {
    return {
      data: this.toDomain(response.data),
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapBoolean(response: ApiResponseBoolean): boolean {
    return response.data ?? false;
  }

  private toDomain(
    dto?: NotificacionConfigracionResponse | null
  ): NotificacionConfigResponse {
    return {
      activo: dto?.activo ?? false,
      asunto: dto?.asunto ?? '',
      diadDelMes: dto?.diadDelMes ?? 0,
      frecuencia: dto?.frecuencia ?? '',
      horaEnvio: dto?.horaEnvio ?? '',
      id: dto?.id ?? 0,
      institutionCode: dto?.institutionCode ?? '',
      medioEnvio: (dto?.medioEnvio as MedioEnvio) ?? 'EMAIL',
      mensaje: dto?.mensaje ?? '',
      notificationScenarioId: dto?.notificationScenario?.id ?? null,
      notificationScenario: dto?.notificationScenario ?? null,
    };
  }
}
