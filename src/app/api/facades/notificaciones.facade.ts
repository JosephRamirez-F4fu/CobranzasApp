import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  GenerarNotificacionesAutomaticasParaCuota$Params,
  ListarNotificacionesPorConfiguracion$Params,
  ListarNotificacionesPorCuota$Params,
  generarNotificacionesAutomaticasParaCuota,
  listarNotificacionesPorConfiguracion,
  listarNotificacionesPorCuota,
} from '../functions';
import { ApiResponseListNotificacionResponse } from '../models/api-response-list-notificacion-response';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesFacade extends ApiFacadeBase {
  generarAutomaticas(
    params: GenerarNotificacionesAutomaticasParaCuota$Params
  ): Observable<ApiResponseListNotificacionResponse> {
    return this.request(generarNotificacionesAutomaticasParaCuota, params);
  }

  listarPorCuota(
    params: ListarNotificacionesPorCuota$Params
  ): Observable<ApiResponseListNotificacionResponse> {
    return this.request(listarNotificacionesPorCuota, params);
  }

  listarPorConfiguracion(
    params: ListarNotificacionesPorConfiguracion$Params
  ): Observable<ApiResponseListNotificacionResponse> {
    return this.request(listarNotificacionesPorConfiguracion, params);
  }
}
