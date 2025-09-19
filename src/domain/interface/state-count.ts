import { Estado } from '../enums/status-pay';

export interface EstadoCuenta {
  id: number;
  periodoAcademico: string;
  cuota: string;
  monto: number;
  saldo: number;
  fechaVencimiento: Date;
  estado: Estado;
  alumnoId: number;
}
