import { NivelEducativo } from './level-education';

export interface Schedule {
  id: number;
  anioLectivo: number;
  nivelEducativo: NivelEducativo;
  montoCuota: number;
  numCuotas: number;
  mesInicio: number;
  diaCobranza: number;
  interesMoraCuota: number;
  activo: boolean;
}
