import { FormatoReporte } from '../enums/format-report';
import { TipoReporte } from '../enums/type-report';

export interface Report {
  id: number;
  fechaGeneracion: Date;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: TipoReporte;
  formato: FormatoReporte;
}
