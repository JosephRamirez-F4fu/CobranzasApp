import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarConfiguracionDeNotificacion$Params,
  ObtenerConfiguracionPorMedio$Params,
  RegistrarConfiguracionDeNotificacion$Params,
  VerificarExistenciaDeConfiguracion$Params,
  actualizarConfiguracionDeNotificacion,
  obtenerConfiguracionPorMedio,
  registrarConfiguracionDeNotificacion,
  verificarExistenciaDeConfiguracion,
} from '../functions';
import { ApiResponseBoolean } from '../models/api-response-boolean';
import { ApiResponseNotificacionConfigracionResponse } from '../models/api-response-notificacion-configracion-response';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionDeNotificacionesFacade extends ApiFacadeBase {
  registrar(
    params: RegistrarConfiguracionDeNotificacion$Params
  ): Observable<ApiResponseNotificacionConfigracionResponse> {
    return this.request(registrarConfiguracionDeNotificacion, params);
  }

  actualizar(
    params: ActualizarConfiguracionDeNotificacion$Params
  ): Observable<ApiResponseNotificacionConfigracionResponse> {
    return this.request(actualizarConfiguracionDeNotificacion, params);
  }

  obtenerPorMedio(
    params: ObtenerConfiguracionPorMedio$Params
  ): Observable<ApiResponseNotificacionConfigracionResponse> {
    return this.request(obtenerConfiguracionPorMedio, params);
  }

  verificarExistencia(
    params: VerificarExistenciaDeConfiguracion$Params
  ): Observable<ApiResponseBoolean> {
    return this.request(verificarExistenciaDeConfiguracion, params);
  }

}
