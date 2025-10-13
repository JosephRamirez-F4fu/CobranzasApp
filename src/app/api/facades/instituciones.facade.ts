import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarConfiguracionLdapDeInstitucion$Params,
  ActualizarInstitucionDesdeMaster$Params,
  ActualizarPlan$Params,
  EliminarInstitucionPorIdentificador$Params,
  ListarInstitucionesConFiltros$Params,
  ObtenerAccionesPorPlan$Params,
  ObtenerInstitucionPorCodigo$Params,
  ObtenerInstitucionPorIdentificador$Params,
  RegistrarInstitucionDesdeMaster$Params,
  actualizarConfiguracionLdapDeInstitucion,
  actualizarInstitucionDesdeMaster,
  actualizarPlan,
  eliminarInstitucionPorIdentificador,
  listarInstitucionesConFiltros,
  obtenerAccionesPorPlan,
  obtenerInstitucionPorCodigo,
  obtenerInstitucionPorIdentificador,
  registrarInstitucionDesdeMaster,
} from '../functions';
import { ApiResponseInstitutionResponse } from '../models/api-response-institution-response';
import { ApiResponsePageInstitutionResponse } from '../models/api-response-page-institution-response';
import { ApiResponsePlanActionsResponse } from '../models/api-response-plan-actions-response';
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

  actualizarPlan(
    params: ActualizarPlan$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(actualizarPlan, params);
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

  obtenerAccionesPorPlan(
    params: ObtenerAccionesPorPlan$Params
  ): Observable<ApiResponsePlanActionsResponse> {
    return this.request(obtenerAccionesPorPlan, params);
  }

  actualizarLdap(
    params: ActualizarConfiguracionLdapDeInstitucion$Params
  ): Observable<ApiResponseInstitutionResponse> {
    return this.request(actualizarConfiguracionLdapDeInstitucion, params);
  }
}
