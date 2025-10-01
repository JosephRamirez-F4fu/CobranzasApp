import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ListarPagosRegistradosPorAlumno$Params,
  ListarPagosRegistradosPorCuota$Params,
  ListarPagosRegistradosPorMatricula$Params,
  RegistrarPagoAutomaticoDesdeIntegracion$Params,
  RegistrarPagoManualDesdePanel$Params,
  listarPagosRegistradosPorAlumno,
  listarPagosRegistradosPorCuota,
  listarPagosRegistradosPorMatricula,
  registrarPagoAutomaticoDesdeIntegracion,
  registrarPagoManualDesdePanel,
} from '../functions';
import { ApiResponseListPagoResponse } from '../models/api-response-list-pago-response';
import { ApiResponseString } from '../models/api-response-string';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class PagosFacade extends ApiFacadeBase {
  registrarManual(
    params: RegistrarPagoManualDesdePanel$Params
  ): Observable<ApiResponseString> {
    return this.request(registrarPagoManualDesdePanel, params);
  }

  registrarAutomatico(
    params: RegistrarPagoAutomaticoDesdeIntegracion$Params
  ): Observable<ApiResponseString> {
    return this.request(registrarPagoAutomaticoDesdeIntegracion, params);
  }

  listarPorMatricula(
    params: ListarPagosRegistradosPorMatricula$Params
  ): Observable<ApiResponseListPagoResponse> {
    return this.request(listarPagosRegistradosPorMatricula, params);
  }

  listarPorCuota(
    params: ListarPagosRegistradosPorCuota$Params
  ): Observable<ApiResponseListPagoResponse> {
    return this.request(listarPagosRegistradosPorCuota, params);
  }

  listarPorAlumno(
    params: ListarPagosRegistradosPorAlumno$Params
  ): Observable<ApiResponseListPagoResponse> {
    return this.request(listarPagosRegistradosPorAlumno, params);
  }
}
