import { MetodoPago } from '../enums/kind-pay';
import { PasarelaPago } from '../enums/pos';

export interface Pago {
  id: number;
  montoPagado: number;
  fechaPago: Date;
  metodoPago: MetodoPago;
  pasarela: PasarelaPago;
  numeroOperacion: string;
  observaciones: string;
}
