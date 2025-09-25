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

import { ApiService } from '@shared/api/api.service';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PaymentGatewayService {
  private api = inject(ApiService);
  private readonly base = 'pasarela-pago';

  registrar(data: PasarelaPagoRegister): Observable<PasarelaPagoResponse> {
    return this.api
      .post<PasarelaPagoRegister, PasarelaPagoResponse>(`${this.base}`, data)
      .pipe(map((r) => r.data));
  }

  obtenerPorInstitucion(code: string): Observable<PasarelaPagoResponse> {
    return this.api
      .get<PasarelaPagoResponse>(
        `${this.base}/institucion/${encodeURIComponent(code)}`
      )
      .pipe(map((r) => r.data));
  }

  existePorInstitucion(code: string): Observable<boolean> {
    return this.api
      .get<boolean>(`${this.base}/existe/${encodeURIComponent(code)}`)
      .pipe(map((r) => r.data));
  }

  editar(
    code: string,
    data: PasarelaPagoRegister
  ): Observable<PasarelaPagoResponse> {
    return this.api
      .put<PasarelaPagoRegister, PasarelaPagoResponse>(
        `${this.base}/${encodeURIComponent(code)}`,
        data
      )
      .pipe(map((r) => r.data));
  }
}
