import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { EstadoDeCuentaFacade } from '../../api/facades/estado-de-cuenta.facade';
import { ApiResponsePageCuentaResponse } from '../../api/models/api-response-page-cuenta-response';
import { ApiResponseListCuentaResponse } from '../../api/models/api-response-list-cuenta-response';
import { ApiResponseString } from '../../api/models/api-response-string';
import { CuentaResponse } from '../../api/models/cuenta-response';
import { ApiResponse } from '../../shared/api/api.service';

export type InstitutionAccountStatementStatus = NonNullable<CuentaResponse['estado']>;

export interface InstitutionAccountStatementItem {
  studentId: number;
  scheduleDetailId: number;
  academicPeriod: string;
  quotaLabel: string;
  status: InstitutionAccountStatementStatus;
  dueDate: string;
  amount: number;
  balance: number;
}

export interface InstitutionAccountStatementPage {
  items: InstitutionAccountStatementItem[];
  totalItems: number;
  totalPages: number;
}

export interface InstitutionAccountStatementFilters {
  academicPeriod?: string;
  status?: InstitutionAccountStatementStatus;
  studentId?: number;
  scheduleId?: number;
}

export interface InstitutionAccountStatementDetail {
  studentId: number;
  scheduleId: number;
  items: InstitutionAccountStatementItem[];
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionAccountStatementService {
  private readonly api = inject(EstadoDeCuentaFacade);

  list(page: number, size: number, filters?: InstitutionAccountStatementFilters) {
    return this.api
      .listar({
        page,
        size,
        periodoAcademico: filters?.academicPeriod || undefined,
        estado: filters?.status || undefined,
        alumnoId: filters?.studentId || undefined,
        cronogramaId: filters?.scheduleId || undefined,
      })
      .pipe(map((response) => this.mapPageResponse(response)));
  }

  enrollStudent(scheduleId: number, studentId: number) {
    return this.api
      .matricular({
        body: {
          id_alumno: studentId,
          id_cronograma: scheduleId,
        },
      })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  getScheduleDetail(scheduleId: number, studentId: number) {
    return this.api
      .obtenerDetalle({
        id_cronograma: scheduleId,
        id_alumno: studentId,
      })
      .pipe(map((response) => this.mapListResponse(response, scheduleId, studentId)));
  }

  private mapPageResponse(
    response: ApiResponsePageCuentaResponse
  ): ApiResponse<InstitutionAccountStatementPage> {
    const content = response.data?.content ?? [];

    return {
      data: {
        items: content.map((item) => this.mapToDomain(item)),
        totalItems: response.data?.totalElements ?? content.length,
        totalPages: response.data?.totalPages ?? 0,
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapListResponse(
    response: ApiResponseListCuentaResponse,
    scheduleId: number,
    studentId: number
  ): ApiResponse<InstitutionAccountStatementDetail> {
    const items = response.data ?? [];

    return {
      data: {
        scheduleId,
        studentId,
        items: items.map((item) => {
          const mapped = this.mapToDomain(item);
          return {
            ...mapped,
            studentId: mapped.studentId || studentId,
          };
        }),
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

  private mapToDomain(dto?: CuentaResponse | null): InstitutionAccountStatementItem {
    return {
      studentId: dto?.alumno_id ?? 0,
      scheduleDetailId: dto?.cronograma_cuotas_id ?? 0,
      academicPeriod: dto?.periodoAcademico ?? '',
      quotaLabel: dto?.cuota ?? '',
      status: (dto?.estado ?? 'PENDIENTE') as InstitutionAccountStatementStatus,
      dueDate: dto?.fechaVencimiento ?? '',
      amount: dto?.monto ?? 0,
      balance: dto?.saldo ?? 0,
    };
  }
}
