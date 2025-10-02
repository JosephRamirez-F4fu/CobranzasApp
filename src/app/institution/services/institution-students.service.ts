import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { AlumnosFacade } from '../../api/facades/alumnos.facade';
import { ApiResponse } from '../../shared/api/api.service';
import { ApiResponsePageAlumnoResponse } from '../../api/models/api-response-page-alumno-response';
import { ApiResponseString } from '../../api/models/api-response-string';
import { ApiResponseVoid } from '../../api/models/api-response-void';
import { ApiResponseAlumnoEstadoCuentaResponse } from '../../api/models/api-response-alumno-estado-cuenta-response';
import { AlumnoRegistroRequest } from '../../api/models/alumno-registro-request';
import { AlumnoUpdateRequest } from '../../api/models/alumno-update-request';
import { AlumnoResponsableRequest } from '../../api/models/alumno-responsable-request';
import { AlumnoResponse } from '../../api/models/alumno-response';
import { MatriculaEstadoCuenta } from '../../api/models/matricula-estado-cuenta';
import { PagoResponse } from '../../api/models/pago-response';

export interface InstitutionStudent {
  id: number;
  codAlumno: string;
  nombreCompleto: string;
  dni: string;
  nivel: string;
  grado: string;
  seccion: string;
  direccion: string;
  responsablePago: string;
  emailTutor: string;
  telefonoTutor: string;
}

export interface InstitutionStudentPayload {
  nombreCompleto: string;
  dni: string;
  nivel: string;
  grado: string;
  seccion: string;
  direccion: string;
  responsablePago: string;
  emailTutor: string;
  telefonoTutor: string;
}

export interface InstitutionStudentFilters {
  nombreCompleto?: string;
  dni?: string;
  grado?: string;
  nivel?: string;
  seccion?: string;
}

export interface InstitutionStudentPage {
  items: InstitutionStudent[];
  totalItems: number;
  totalPages: number;
}

export interface InstitutionStudentPayment {
  id: number;
  fechaPago: string;
  metodoPago: PagoResponse['metodoPago'] | null;
  montoPagado: number;
  numeroOperacion: string;
  observaciones: string;
  pasarela: PagoResponse['pasarela'] | null;
}

export interface InstitutionStudentEnrollment {
  id: number;
  periodoAcademico: string;
  estado: MatriculaEstadoCuenta['estado'] | 'PENDIENTE';
  montoTotal: number;
  totalPagado: number;
  saldoPendiente: number;
  morosidad: number;
  pagos: InstitutionStudentPayment[];
}

export interface InstitutionStudentAccountStatus {
  id: number;
  nombreCompleto: string;
  totalPagado: number;
  totalPendiente: number;
  morosidad: number;
  matriculas: InstitutionStudentEnrollment[];
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionStudentsService {
  private readonly api = inject(AlumnosFacade);

  list(page: number, size: number, filters?: InstitutionStudentFilters) {
    return this.api
      .listar({
        page,
        size,
        nombreCompleto: filters?.nombreCompleto || undefined,
        dni: filters?.dni || undefined,
        grado: filters?.grado || undefined,
        nivel: filters?.nivel || undefined,
        seccion: filters?.seccion || undefined,
      })
      .pipe(map((response) => this.mapPageResponse(response)));
  }

  create(payload: InstitutionStudentPayload) {
    return this.api
      .registrar({ body: this.mapToCreateRequest(payload) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }

  update(id: number, payload: InstitutionStudentPayload) {
    return this.api
      .actualizarDatosGenerales({ id, body: this.mapToUpdateRequest(payload) })
      .pipe(
        switchMap(() =>
          this.api.actualizarDocumentoIdentidad({ id, dni: payload.dni })
        ),
        switchMap(() =>
          this.api.actualizarResponsablePago({
            id,
            body: this.mapToResponsibleRequest(payload),
          })
        ),
        map((response) => this.mapStringResponse(response))
      );
  }

  remove(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  getAccountStatus(id: number) {
    return this.api
      .obtenerEstadoCuenta({ id })
      .pipe(map((response) => this.mapAccountStatusResponse(response)));
  }

  private mapPageResponse(
    response: ApiResponsePageAlumnoResponse
  ): ApiResponse<InstitutionStudentPage> {
    const content = response.data?.content ?? [];

    return {
      data: {
        items: content.map((student) => this.mapToDomain(student)),
        totalItems: response.data?.totalElements ?? content.length,
        totalPages: response.data?.totalPages ?? 0,
      },
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapAccountStatusResponse(
    response: ApiResponseAlumnoEstadoCuentaResponse
  ): ApiResponse<InstitutionStudentAccountStatus> {
    const status = response.data;

    return {
      data: {
        id: status?.alumnoId ?? 0,
        nombreCompleto: status?.nombreCompleto ?? '',
        totalPagado: status?.totalPagado ?? 0,
        totalPendiente: status?.totalPendiente ?? 0,
        morosidad: status?.morosidad ?? 0,
        matriculas: (status?.matriculas ?? []).map((enrollment) => ({
          id: enrollment?.id ?? 0,
          periodoAcademico: enrollment?.periodoAcademico ?? '',
          estado: enrollment?.estado ?? 'PENDIENTE',
          montoTotal: enrollment?.montoTotal ?? 0,
          totalPagado: enrollment?.totalPagado ?? 0,
          saldoPendiente: enrollment?.saldoPendiente ?? 0,
          morosidad: enrollment?.morosidad ?? 0,
          pagos: (enrollment?.pagos ?? []).map((payment) => ({
            id: payment?.id ?? 0,
            fechaPago: payment?.fechaPago ?? '',
            metodoPago: payment?.metodoPago ?? null,
            montoPagado: payment?.montoPagado ?? 0,
            numeroOperacion: payment?.numeroOperacion ?? '',
            observaciones: payment?.observaciones ?? '',
            pasarela: payment?.pasarela ?? null,
          })),
        })),
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

  private mapVoidResponse(response: ApiResponseVoid): ApiResponse<void> {
    return {
      data: undefined,
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }

  private mapToDomain(dto?: AlumnoResponse | null): InstitutionStudent {
    return {
      id: dto?.id ?? 0,
      codAlumno: dto?.codAlumno ?? '',
      nombreCompleto: dto?.nombreCompleto ?? '',
      dni: dto?.dni ?? '',
      nivel: dto?.nivel ?? '',
      grado: dto?.grado ?? '',
      seccion: dto?.seccion ?? '',
      direccion: dto?.direccion ?? '',
      responsablePago: dto?.responsablePago ?? '',
      emailTutor: dto?.emailTutor ?? '',
      telefonoTutor: dto?.telefonoTutor ?? '',
    };
  }

  private mapToCreateRequest(
    payload: InstitutionStudentPayload
  ): AlumnoRegistroRequest {
    return {
      nombreCompleto: payload.nombreCompleto,
      dni: payload.dni,
      nivel: payload.nivel,
      grado: payload.grado,
      seccion: payload.seccion,
      direccion: payload.direccion,
      responsablePago: payload.responsablePago,
      emailTutor: payload.emailTutor,
      telefonoTutor: payload.telefonoTutor,
    };
  }

  private mapToUpdateRequest(payload: InstitutionStudentPayload): AlumnoUpdateRequest {
    return {
      nombreCompleto: payload.nombreCompleto,
      nivel: payload.nivel,
      grado: payload.grado,
      seccion: payload.seccion,
      direccion: payload.direccion,
    };
  }

  private mapToResponsibleRequest(
    payload: InstitutionStudentPayload
  ): AlumnoResponsableRequest {
    return {
      responsablePago: payload.responsablePago,
      emailTutor: payload.emailTutor,
      telefonoTutor: payload.telefonoTutor,
    };
  }
}
