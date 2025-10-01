import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarMontoYSaldoDeCuenta$Params,
  ListarEstadosDeCuentaConFiltros$Params,
  MatricularAlumnoACronogramaSeleccionado$Params,
  ObtenerEstadoCuentaDeAlumnoPorCronograma$Params,
  actualizarMontoYSaldoDeCuenta,
  listarEstadosDeCuentaConFiltros,
  matricularAlumnoACronogramaSeleccionado,
  obtenerEstadoCuentaDeAlumnoPorCronograma,
} from '../functions';
import { ApiResponseAlumnoEstadoCuentaResponse } from '../models/api-response-alumno-estado-cuenta-response';
import { ApiResponsePageEstadoCuentaResponse } from '../models/api-response-page-estado-cuenta-response';
import { ApiResponseString } from '../models/api-response-string';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class EstadoDeCuentaFacade extends ApiFacadeBase {
  listar(
    params?: ListarEstadosDeCuentaConFiltros$Params
  ): Observable<ApiResponsePageEstadoCuentaResponse> {
    return this.request(listarEstadosDeCuentaConFiltros, params);
  }

  actualizarMonto(
    params: ActualizarMontoYSaldoDeCuenta$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarMontoYSaldoDeCuenta, params);
  }

  matricular(
    params: MatricularAlumnoACronogramaSeleccionado$Params
  ): Observable<ApiResponseString> {
    return this.request(matricularAlumnoACronogramaSeleccionado, params);
  }

  obtenerDetalle(
    params: ObtenerEstadoCuentaDeAlumnoPorCronograma$Params
  ): Observable<ApiResponseAlumnoEstadoCuentaResponse> {
    return this.request(obtenerEstadoCuentaDeAlumnoPorCronograma, params);
  }
}
