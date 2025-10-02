import { inject, Injectable, signal } from '@angular/core';
import { Student } from '@domain/interface/student';
import type { ApiResponse } from '@shared/api/api.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { AlumnosFacade } from '../api/facades/alumnos.facade';
import { ApiResponsePageAlumnoResponse } from '../api/models/api-response-page-alumno-response';
import { ApiResponseString } from '../api/models/api-response-string';
import { ApiResponseVoid } from '../api/models/api-response-void';
import { AlumnoRegistroRequest } from '../api/models/alumno-registro-request';
import { AlumnoResponse } from '../api/models/alumno-response';
import { AlumnoResponsableRequest } from '../api/models/alumno-responsable-request';
import { AlumnoUpdateRequest } from '../api/models/alumno-update-request';

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class StudentMapper {
  static toRegisterRequest(student: Student): AlumnoRegistroRequest {
    return {
      direccion: student.direccion,
      dni: student.dni,
      emailTutor: student.emailTutor,
      grado: student.grado,
      nivel: student.nivel ?? undefined,
      nombreCompleto: student.nombreCompleto,
      responsablePago: student.responsablePago,
      seccion: student.seccion,
      telefonoTutor: student.telefonoTutor,
    };
  }

  static toUpdateRequest(student: Student): AlumnoUpdateRequest {
    return {
      direccion: student.direccion,
      grado: student.grado,
      nivel: student.nivel ?? undefined,
      nombreCompleto: student.nombreCompleto,
      seccion: student.seccion,
    };
  }

  static toResponsibleRequest(
    student: Student
  ): AlumnoResponsableRequest {
    return {
      emailTutor: student.emailTutor,
      responsablePago: student.responsablePago,
      telefonoTutor: student.telefonoTutor,
    };
  }

  static fromApi(dto?: AlumnoResponse | null): Student {
    return {
      id: dto?.id ?? 0,
      codAlumno: dto?.codAlumno ?? '',
      nombreCompleto: dto?.nombreCompleto ?? '',
      dni: dto?.dni ?? '',
      grado: dto?.grado ?? '',
      seccion: dto?.seccion ?? '',
      nivel: dto?.nivel ?? null,
      responsablePago: dto?.responsablePago ?? '',
      telefonoTutor: dto?.telefonoTutor ?? '',
      emailTutor: dto?.emailTutor ?? '',
      direccion: dto?.direccion ?? '',
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class StundentsService {
  private readonly api = inject(AlumnosFacade);
  students = signal<PageResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  selectedStudent = signal<Student | null>(null);

  addStudent(student: Student) {
    return this.api
      .registrar({ body: StudentMapper.toRegisterRequest(student) })
      .pipe(map((response) => this.mapStringResponse(response)));
  }
  updateStudent(student: Student, id: number) {
    return this.api
      .actualizarDatosGenerales({
        id,
        body: StudentMapper.toUpdateRequest(student),
      })
      .pipe(
        switchMap(() =>
          this.api.actualizarDocumentoIdentidad({ id, dni: student.dni })
        ),
        switchMap(() =>
          this.api.actualizarResponsablePago({
            id,
            body: StudentMapper.toResponsibleRequest(student),
          })
        ),
        map((response) => this.mapStringResponse(response))
      );
  }
  deleteStudent(id: number) {
    return this.api
      .eliminar({ id })
      .pipe(map((response) => this.mapVoidResponse(response)));
  }
  loadStudents() {
    const page = this.students().page;
    const pageSize = this.students().pageSize;

    return this.api
      .listar({ page: page - 1, size: pageSize })
      .pipe(
        map((response) => this.mapPageResponse(response, page, pageSize)),
        tap((response) => this.students.set(response.data))
      );
  }
  selectStudent(id: number) {
    const student = this.students().data.find((s) => s.id === id) || null;
    this.selectedStudent.set(student);
  }
  clearSelectedStudent() {
    this.selectedStudent.set(null);
  }
  pageStudents(page: number, pageSize: number) {
    this.students.set({
      ...this.students(),
      page,
      pageSize,
    });
    return this.api
      .listar({ page: page - 1, size: pageSize })
      .pipe(
        map((response) => this.mapPageResponse(response, page, pageSize)),
        tap((response) => this.students.set(response.data))
      );
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

  private mapPageResponse(
    response: ApiResponsePageAlumnoResponse,
    page: number,
    pageSize: number
  ): ApiResponse<PageResult<Student>> {
    const content = response.data?.content ?? [];

    const result: PageResult<Student> = {
      data: content.map((item) => StudentMapper.fromApi(item)),
      total: response.data?.totalElements ?? 0,
      page,
      pageSize,
    };

    return {
      data: result,
      message: response.message ?? '',
      status: response.success ?? false,
    };
  }
}
