import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CompletarAutenticacion$Params, completarAutenticacion } from '../functions';
import { ApiResponseAccessTokenResponse } from '../models/api-response-access-token-response';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class OtpFacade extends ApiFacadeBase {
  verificarCodigo(
    params: CompletarAutenticacion$Params
  ): Observable<ApiResponseAccessTokenResponse> {
    return this.request(completarAutenticacion, params);
  }
}
