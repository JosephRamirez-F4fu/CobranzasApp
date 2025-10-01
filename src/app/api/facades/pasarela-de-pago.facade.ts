import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarConfiguracionDePasarela$Params,
  ObtenerConfiguracionPorCodigoInstitucion$Params,
  ProcesarPagoEnPasarela$Params,
  RegistrarConfiguracionDePasarela$Params,
  VerificarExistenciaDePasarela$Params,
  actualizarConfiguracionDePasarela,
  obtenerConfiguracionPorCodigoInstitucion,
  procesarPagoEnPasarela,
  registrarConfiguracionDePasarela,
  verificarExistenciaDePasarela,
} from '../functions';
import { ApiResponseBoolean } from '../models/api-response-boolean';
import { ApiResponsePasarelaPagoResponse } from '../models/api-response-pasarela-pago-response';
import { ApiResponseString } from '../models/api-response-string';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class PasarelaDePagoFacade extends ApiFacadeBase {
  registrar(
    params: RegistrarConfiguracionDePasarela$Params
  ): Observable<ApiResponsePasarelaPagoResponse> {
    return this.request(registrarConfiguracionDePasarela, params);
  }

  actualizar(
    params: ActualizarConfiguracionDePasarela$Params
  ): Observable<ApiResponsePasarelaPagoResponse> {
    return this.request(actualizarConfiguracionDePasarela, params);
  }

  obtener(
    params: ObtenerConfiguracionPorCodigoInstitucion$Params
  ): Observable<ApiResponsePasarelaPagoResponse> {
    return this.request(obtenerConfiguracionPorCodigoInstitucion, params);
  }

  verificar(
    params: VerificarExistenciaDePasarela$Params
  ): Observable<ApiResponseBoolean> {
    return this.request(verificarExistenciaDePasarela, params);
  }

  procesar(
    params: ProcesarPagoEnPasarela$Params
  ): Observable<ApiResponseString> {
    return this.request(procesarPagoEnPasarela, params);
  }
}
