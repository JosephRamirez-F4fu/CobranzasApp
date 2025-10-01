import { inject, Injectable, signal } from '@angular/core';
import { PaymentGatewayType } from '../../domain/dtos/institutionPaymentGateway.dto';

export interface PasarelaPagoRegister {
  apiSecret: string;
  apiPublicKey: string;
  tipo: PaymentGatewayType;
  urlBase: string;
  urlWebhook: string;
  institutionCode: string;
  activo: boolean;
}

export interface PasarelaPagoResponse {
  id: number;
  apiSecret: string;
  apiPublicKey: string;
  tipo: PaymentGatewayType;
  urlBase: string;
  urlWebhook: string;
  institutionCode: string;
  activo: boolean;
}

import { map, Observable } from 'rxjs';
import { PasarelaDePagoFacade } from '../api/facades/pasarela-de-pago.facade';
import { PasarelaPagoRegister as PasarelaPagoRegisterApi } from '../api/models/pasarela-pago-register';
import { PasarelaPagoResponse as PasarelaPagoResponseApi } from '../api/models/pasarela-pago-response';
import { ApiResponsePasarelaPagoResponse } from '../api/models/api-response-pasarela-pago-response';
import { ApiResponseBoolean } from '../api/models/api-response-boolean';
@Injectable({
  providedIn: 'root',
})
export class PaymentGatewayService {
  private api = inject(PasarelaDePagoFacade);

  registrar(data: PasarelaPagoRegister): Observable<PasarelaPagoResponse> {
    return this.api
      .registrar({ body: this.mapToRegister(data) })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  obtenerPorInstitucion(code: string): Observable<PasarelaPagoResponse> {
    return this.api
      .obtener({ institutionCode: code })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  existePorInstitucion(code: string): Observable<boolean> {
    return this.api
      .verificar({ institutionCode: code })
      .pipe(map((response) => this.mapBoolean(response)));
  }

  editar(
    code: string,
    data: PasarelaPagoRegister
  ): Observable<PasarelaPagoResponse> {
    return this.api
      .actualizar({ institutionCode: code, body: this.mapToRegister(data) })
      .pipe(map((response) => this.mapResponse(response).data));
  }

  private mapToRegister(
    data: PasarelaPagoRegister
  ): PasarelaPagoRegisterApi {
    return {
      activo: data.activo,
      apiPublicKey: data.apiPublicKey,
      apiSecret: data.apiSecret,
      institutionCode: data.institutionCode,
      tipo: this.mapGatewayType(data.tipo),
      urlBase: data.urlBase,
      urlWebhook: data.urlWebhook,
    };
  }

  private mapResponse(
    response: ApiResponsePasarelaPagoResponse
  ): { data: PasarelaPagoResponse; message: string; status: boolean } {
    return {
      data: this.toDomain(response.data),
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapBoolean(response: ApiResponseBoolean): boolean {
    return response.data ?? false;
  }

  private toDomain(
    dto?: PasarelaPagoResponseApi | null
  ): PasarelaPagoResponse {
    return {
      id: dto?.id ?? 0,
      apiSecret: dto?.apiSecret ?? '',
      apiPublicKey: dto?.apiPublicKey ?? '',
      tipo: this.mapGatewayTypeFromApi(dto?.tipo),
      urlBase: dto?.urlBase ?? '',
      urlWebhook: dto?.urlWebhook ?? '',
      institutionCode: dto?.institutionCode ?? '',
      activo: dto?.activo ?? false,
    };
  }

  private mapGatewayType(type: PaymentGatewayType): 'Culqui' {
    switch (type) {
      case PaymentGatewayType.CULQUI:
      default:
        return 'Culqui';
    }
  }

  private mapGatewayTypeFromApi(
    type?: 'Culqui' | null
  ): PaymentGatewayType {
    switch (type) {
      case 'Culqui':
        return PaymentGatewayType.CULQUI;
      default:
        return PaymentGatewayType.CULQUI;
    }
  }
}
