import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { CronogramasFacade } from '../../api/facades/cronogramas.facade';
import { ApiResponsePageCronogramaResponse } from '../../api/models/api-response-page-cronograma-response';
import { ApiResponseString } from '../../api/models/api-response-string';
import { CronogramaRequest } from '../../api/models/cronograma-request';
import { CronogramaResponse } from '../../api/models/cronograma-response';
import { CuotaRequest } from '../../api/models/cuota-request';
import { ApiResponse } from '../../shared/api/api.service';

export type InstitutionEnrollmentLevel =
  | 'INICIAL'
  | 'PRIMARIA'
  | 'SECUNDARIA';

export interface InstitutionEnrollmentSchedule {
  id: number;
  anioLectivo: number;
  nivelEducativo: InstitutionEnrollmentLevel | '';
  montoCuota: number;
  numCuotas: number;
  interesMoraCuota: number;
  fechaInicio: string;
  fechaVencimiento: string;
  activo: boolean;
}

export interface InstitutionEnrollmentSchedulePayload {
  anioLectivo: number;
  nivelEducativo: InstitutionEnrollmentLevel;
  montoCuota: number;
  numCuotas: number;
  interesMoraCuota: number;
  fechaInicio: string;
  activo: boolean;
}

export interface InstitutionEnrollmentScheduleFilters {
  anioLectivo?: number;
  nivelEducativo?: InstitutionEnrollmentLevel;
  activo?: boolean;
}

export interface InstitutionEnrollmentSchedulePage {
  items: InstitutionEnrollmentSchedule[];
  totalItems: number;
  totalPages: number;
}

export interface InstitutionEnrollmentScheduleQuotaPayload {
  monto: number;
  fechaVencimiento: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionEnrollmentSchedulesService {
  private readonly api = inject(CronogramasFacade);

  list(
    page: number,
    size: number,
    filters?: InstitutionEnrollmentScheduleFilters
  ) {
    return this.api
      .listar({
        page,
        size,
        anioLectivo: filters?.anioLectivo
          ? String(filters.anioLectivo)
          : undefined,
        nivelEducativo: filters?.nivelEducativo || undefined,
        activo:
          typeof filters?.activo === 'boolean' ? filters.activo : undefined,
      })
      .pipe(map((response) => this.mapPageResponse(response)));
  }

  create(payload: InstitutionEnrollmentSchedulePayload) {
    return this.api
      .crear({ body: this.mapToRequest(payload) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  update(id: number, payload: InstitutionEnrollmentSchedulePayload) {
    return this.api
      .actualizar({ id, body: this.mapToRequest(payload) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  remove(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  updateQuota(
    scheduleId: number,
    payload: InstitutionEnrollmentScheduleQuotaPayload
  ) {
    return this.api
      .actualizarCuota({
        id: scheduleId,
        body: this.mapToQuotaRequest(payload),
      })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  private mapPageResponse(
    response: ApiResponsePageCronogramaResponse
  ): ApiResponse<InstitutionEnrollmentSchedulePage> {
    const content = response.data?.content ?? [];

    return {
      data: {
        items: content.map((schedule) => this.mapToDomain(schedule)),
        totalItems: response.data?.totalElements ?? content.length,
        totalPages: response.data?.totalPages ?? 0,
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapStringResponse(response: ApiResponseString): ApiResponse<void> {
    return {
      data: undefined,
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapToDomain(
    cronograma: CronogramaResponse & { fechaInicio?: string }
  ): InstitutionEnrollmentSchedule {
    const fechaInicio = (cronograma as { fechaInicio?: string }).fechaInicio ?? '';
    const fechaVencimiento = cronograma.fechaVencimiento ?? '';

    return {
      id: cronograma.id ?? 0,
      anioLectivo: cronograma.anioLectivo ?? 0,
      nivelEducativo: (cronograma.nivelEducativo as InstitutionEnrollmentLevel) || '',
      montoCuota: cronograma.montoCuota ?? 0,
      numCuotas: cronograma.numCuotas ?? 0,
      interesMoraCuota: cronograma.interesMoraCuota ?? 0,
      fechaInicio,
      fechaVencimiento,
      activo: cronograma.activo ?? false,
    };
  }

  private mapToRequest(
    payload: InstitutionEnrollmentSchedulePayload
  ): CronogramaRequest {
    return {
      activo: payload.activo,
      anioLectivo: payload.anioLectivo,
      fechaInicio: payload.fechaInicio,
      interesMoraCuota: payload.interesMoraCuota,
      montoCuota: payload.montoCuota,
      nivelEducativo: payload.nivelEducativo,
      numCuotas: payload.numCuotas,
    };
  }

  private mapToQuotaRequest(
    payload: InstitutionEnrollmentScheduleQuotaPayload
  ): CuotaRequest {
    return {
      monto: payload.monto,
      fechaVencimiento: payload.fechaVencimiento,
    };
  }
}
