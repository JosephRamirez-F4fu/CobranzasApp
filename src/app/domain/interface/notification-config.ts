import { MedioEnvio } from '../enums/type-send';
export interface NotificationConfig {
  medioEnvio: MedioEnvio;
  frecuencia: string;
  diaDelMes: number;
  horaEnvio: string;
  activo: boolean;
}
