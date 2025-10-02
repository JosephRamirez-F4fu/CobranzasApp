import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CerrarSesionConRefreshToken$Params,
  IniciarSesionConCredenciales$Params,
  RenovarTokenDeAcceso$Params,
  cerrarSesionConRefreshToken,
  iniciarSesionConCredenciales,
  renovarTokenDeAcceso,
} from '../functions';
import { ApiResponseAccessTokenResponse } from '../models/api-response-access-token-response';
import { ApiResponseOtpChallengeResponse } from '../models/api-response-otp-challenge-response';
import { ApiResponseVoid } from '../models/api-response-void';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionFacade extends ApiFacadeBase {
  iniciarSesion(
    params: IniciarSesionConCredenciales$Params
  ): Observable<ApiResponseOtpChallengeResponse> {
    return this.request(iniciarSesionConCredenciales, params);
  }

  cerrarSesion(
    params?: CerrarSesionConRefreshToken$Params
  ): Observable<ApiResponseVoid> {
    return this.request(cerrarSesionConRefreshToken, params);
  }

  renovarToken(
    params?: RenovarTokenDeAcceso$Params
  ): Observable<ApiResponseAccessTokenResponse> {
    return this.request(renovarTokenDeAcceso, params);
  }
}
