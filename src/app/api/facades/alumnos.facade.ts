import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarDatosGeneralesDelAlumno$Params,
  ActualizarDocumentoIdentidadDelAlumno$Params,
  ActualizarResponsableDePagoDelAlumno$Params,
  EliminarAlumnoPorIdentificador$Params,
  ListarAlumnosConFiltros$Params,
  ObtenerEstadoDeCuentaDelAlumno$Params,
  RegistrarAlumnoEnInstitucionAutenticada$Params,
  actualizarDatosGeneralesDelAlumno,
  actualizarDocumentoIdentidadDelAlumno,
  actualizarResponsableDePagoDelAlumno,
  eliminarAlumnoPorIdentificador,
  listarAlumnosConFiltros,
  obtenerEstadoDeCuentaDelAlumno,
  registrarAlumnoEnInstitucionAutenticada,
} from '../functions';
import { ApiResponseAlumnoEstadoCuentaResponse } from '../models/api-response-alumno-estado-cuenta-response';
import { ApiResponsePageAlumnoResponse } from '../models/api-response-page-alumno-response';
import { ApiResponseString } from '../models/api-response-string';
import { ApiResponseVoid } from '../models/api-response-void';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class AlumnosFacade extends ApiFacadeBase {
  registrar(
    params: RegistrarAlumnoEnInstitucionAutenticada$Params
  ): Observable<ApiResponseString> {
    return this.request(registrarAlumnoEnInstitucionAutenticada, params);
  }

  listar(
    params?: ListarAlumnosConFiltros$Params
  ): Observable<ApiResponsePageAlumnoResponse> {
    return this.request(listarAlumnosConFiltros, params);
  }

  actualizarDatosGenerales(
    params: ActualizarDatosGeneralesDelAlumno$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarDatosGeneralesDelAlumno, params);
  }

  actualizarDocumentoIdentidad(
    params: ActualizarDocumentoIdentidadDelAlumno$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarDocumentoIdentidadDelAlumno, params);
  }

  actualizarResponsablePago(
    params: ActualizarResponsableDePagoDelAlumno$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarResponsableDePagoDelAlumno, params);
  }

  obtenerEstadoCuenta(
    params: ObtenerEstadoDeCuentaDelAlumno$Params
  ): Observable<ApiResponseAlumnoEstadoCuentaResponse> {
    return this.request(obtenerEstadoDeCuentaDelAlumno, params);
  }

  eliminar(
    params: EliminarAlumnoPorIdentificador$Params
  ): Observable<ApiResponseVoid> {
    return this.request(eliminarAlumnoPorIdentificador, params);
  }
}
