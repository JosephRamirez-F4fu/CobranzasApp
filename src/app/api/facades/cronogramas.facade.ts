import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarCronogramaExistente$Params,
  ActualizarCuotaDeCronograma$Params,
  CrearCronogramaParaInstitucionAutenticada$Params,
  EliminarCronogramaDeInstitucionAutenticada$Params,
  ListarCronogramasConFiltros$Params,
  ListarCuotasPorCronograma$Params,
  ObtenerCronogramaConCuotas$Params,
  actualizarCronogramaExistente,
  actualizarCuotaDeCronograma,
  crearCronogramaParaInstitucionAutenticada,
  eliminarCronogramaDeInstitucionAutenticada,
  listarCronogramasConFiltros,
  listarCuotasPorCronograma,
  obtenerCronogramaConCuotas,
} from '../functions';
import { ApiResponseCronogramaDetalleResponse } from '../models/api-response-cronograma-detalle-response';
import { ApiResponseListCuotaResponse } from '../models/api-response-list-cuota-response';
import { ApiResponsePageCronogramaResponse } from '../models/api-response-page-cronograma-response';
import { ApiResponseString } from '../models/api-response-string';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class CronogramasFacade extends ApiFacadeBase {
  crear(
    params: CrearCronogramaParaInstitucionAutenticada$Params
  ): Observable<ApiResponseString> {
    return this.request(crearCronogramaParaInstitucionAutenticada, params);
  }

  actualizar(
    params: ActualizarCronogramaExistente$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarCronogramaExistente, params);
  }

  actualizarCuota(
    params: ActualizarCuotaDeCronograma$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarCuotaDeCronograma, params);
  }

  eliminar(
    params: EliminarCronogramaDeInstitucionAutenticada$Params
  ): Observable<ApiResponseString> {
    return this.request(eliminarCronogramaDeInstitucionAutenticada, params);
  }

  listar(
    params?: ListarCronogramasConFiltros$Params
  ): Observable<ApiResponsePageCronogramaResponse> {
    return this.request(listarCronogramasConFiltros, params);
  }

  listarCuotas(
    params: ListarCuotasPorCronograma$Params
  ): Observable<ApiResponseListCuotaResponse> {
    return this.request(listarCuotasPorCronograma, params);
  }

  obtenerDetalle(
    params: ObtenerCronogramaConCuotas$Params
  ): Observable<ApiResponseCronogramaDetalleResponse> {
    return this.request(obtenerCronogramaConCuotas, params);
  }
}
