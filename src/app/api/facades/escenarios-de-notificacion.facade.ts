import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarEscenario$Params,
  CrearEscenario$Params,
  EliminarEscenario$Params,
  ListarEscenarios$Params,
  ObtenerEscenario$Params,
  actualizarEscenario,
  crearEscenario,
  eliminarEscenario,
  listarEscenarios,
  obtenerEscenario,
} from '../functions';
import { ApiResponseListNotificationScenarioResponse } from '../models/api-response-list-notification-scenario-response';
import { ApiResponseNotificationScenarioResponse } from '../models/api-response-notification-scenario-response';
import { ApiResponseVoid } from '../models/api-response-void';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class EscenariosDeNotificacionFacade extends ApiFacadeBase {
  listar(
    params?: ListarEscenarios$Params
  ): Observable<ApiResponseListNotificationScenarioResponse> {
    return this.request(listarEscenarios, params);
  }

  obtener(
    params: ObtenerEscenario$Params
  ): Observable<ApiResponseNotificationScenarioResponse> {
    return this.request(obtenerEscenario, params);
  }

  crear(
    params: CrearEscenario$Params
  ): Observable<ApiResponseNotificationScenarioResponse> {
    return this.request(crearEscenario, params);
  }

  actualizar(
    params: ActualizarEscenario$Params
  ): Observable<ApiResponseNotificationScenarioResponse> {
    return this.request(actualizarEscenario, params);
  }

  eliminar(
    params: EliminarEscenario$Params
  ): Observable<ApiResponseVoid> {
    return this.request(eliminarEscenario, params);
  }
}
