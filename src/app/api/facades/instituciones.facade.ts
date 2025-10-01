import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarConfiguracionLdapDeInstitucion$Params,
  ActualizarInstitucionDesdeMaster$Params,
  EliminarInstitucionPorIdentificador$Params,
  ListarInstitucionesConFiltros$Params,
  ObtenerInstitucionPorCodigo$Params,
  ObtenerInstitucionPorIdentificador$Params,
  RegistrarInstitucionDesdeMaster$Params,
  actualizarConfiguracionLdapDeInstitucion,
  actualizarInstitucionDesdeMaster,
  eliminarInstitucionPorIdentificador,
  listarInstitucionesConFiltros,
  obtenerInstitucionPorCodigo,
  obtenerInstitucionPorIdentificador,
  registrarInstitucionDesdeMaster,
} from '../functions';
import { ApiResponseInstitutionResponse } from '../models/api-response-institution-response';
import { ApiResponsePageInstitutionResponse } from '../models/api-response-page-institution-response';
import { ApiResponseVoid } from '../models/api-response-void';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class InstitucionesFacade extends ApiFacadeBase {
  registrar(
    params: RegistrarInstitucionDesdeMaster$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(registrarInstitucionDesdeMaster, params);
  }

  actualizar(
    params: ActualizarInstitucionDesdeMaster$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(actualizarInstitucionDesdeMaster, params);
  }

  eliminar(
    params: EliminarInstitucionPorIdentificador$Params
  ): Observable<ApiResponseVoid> {
    return this.request(eliminarInstitucionPorIdentificador, params);
  }

  listar(
    params?: ListarInstitucionesConFiltros$Params
  ): Observable<ApiResponsePageInstitutionResponse> {
    return this.request(listarInstitucionesConFiltros, params);
  }

  obtenerPorId(
    params: ObtenerInstitucionPorIdentificador$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(obtenerInstitucionPorIdentificador, params);
  }

  obtenerPorCodigo(
    params: ObtenerInstitucionPorCodigo$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(obtenerInstitucionPorCodigo, params);
  }

  actualizarLdap(
    params: ActualizarConfiguracionLdapDeInstitucion$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(actualizarConfiguracionLdapDeInstitucion, params);
  }
}
