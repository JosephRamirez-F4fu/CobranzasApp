import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import {
  InstitutionStudent,
  InstitutionStudentFilters,
  InstitutionStudentPayload,
  InstitutionStudentsService,
} from '../../../services/institution-students.service';
import { InstitutionStudentFormComponent } from '../../../components/student-form/student-form.component';
import { InstitutionStudentTableComponent } from '../../../components/student-table/student-table.component';

interface InstitutionStudentFormValue extends InstitutionStudentPayload {
  id: number | null;
}

type InstitutionStudentFormGroup = FormGroup<{
  id: FormControl<number | null>;
  nombreCompleto: FormControl<string>;
  dni: FormControl<string>;
  nivel: FormControl<string>;
  grado: FormControl<string>;
  seccion: FormControl<string>;
  direccion: FormControl<string>;
  responsablePago: FormControl<string>;
  emailTutor: FormControl<string>;
  telefonoTutor: FormControl<string>;
}>;

type InstitutionStudentFiltersFormGroup = FormGroup<{
  nombreCompleto: FormControl<string>;
  dni: FormControl<string>;
}>;

@Component({
  selector: 'app-students-show',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InstitutionStudentFormComponent,
    InstitutionStudentTableComponent,
  ],
  templateUrl: './studentsShow.component.html',
  host: {
    class: 'block min-h-full bg-slate-100 p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StudentsShowComponent {
  private readonly fb = inject(FormBuilder);
  private readonly studentsService = inject(InstitutionStudentsService);

  readonly students = signal<InstitutionStudent[]>([]);
  readonly totalPages = signal(0);
  readonly totalItems = signal(0);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly page = signal(0);
  readonly editing = signal(false);
  readonly feedback = signal<string | null>(null);

  readonly form: InstitutionStudentFormGroup = this.fb.group({
    id: this.fb.control<number | null>(null),
    nombreCompleto: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    dni: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(12)],
    }),
    nivel: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    grado: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    seccion: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    direccion: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    responsablePago: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    emailTutor: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email],
    }),
    telefonoTutor: this.fb.nonNullable.control(''),
  });

  readonly filtersForm: InstitutionStudentFiltersFormGroup = this.fb.group({
    nombreCompleto: this.fb.nonNullable.control(''),
    dni: this.fb.nonNullable.control(''),
  });

  private readonly pageSize = 10;
  private readonly filters = signal<InstitutionStudentFilters>({});

  constructor() {
    this.load();
  }

  load(page = this.page()) {
    this.loading.set(true);
    this.studentsService
      .list(page, this.pageSize, this.filters())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.students.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
          this.totalItems.set(response.data.totalItems);
          this.page.set(page);
        },
        error: (error) => this.handleError(error),
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as InstitutionStudentFormValue;
    const payload: InstitutionStudentPayload = {
      nombreCompleto: value.nombreCompleto,
      dni: value.dni,
      nivel: value.nivel,
      grado: value.grado,
      seccion: value.seccion,
      direccion: value.direccion,
      responsablePago: value.responsablePago,
      emailTutor: value.emailTutor,
      telefonoTutor: value.telefonoTutor,
    };

    this.saving.set(true);
    const request$ = value.id
      ? this.studentsService.update(value.id, payload)
      : this.studentsService.create(payload);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(response.message || 'Operación completada correctamente.');
          const isEditing = Boolean(value.id);
          this.resetForm();
          this.load(isEditing ? this.page() : 0);
        },
        error: (error) => this.handleError(error),
      });
  }

  onEdit(student: InstitutionStudent) {
    this.form.reset({
      id: student.id,
      nombreCompleto: student.nombreCompleto,
      dni: student.dni,
      nivel: student.nivel,
      grado: student.grado,
      seccion: student.seccion,
      direccion: student.direccion,
      responsablePago: student.responsablePago,
      emailTutor: student.emailTutor,
      telefonoTutor: student.telefonoTutor,
    });
    this.editing.set(true);
  }

  onDelete(student: InstitutionStudent) {
    if (!confirm(`Esta acción eliminará al alumno ${student.nombreCompleto}. ¿Desea continuar?`)) {
      return;
    }

    this.saving.set(true);
    this.studentsService
      .remove(student.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(response.message || 'Alumno eliminado correctamente.');
          const currentPage = this.page();
          this.load(currentPage);
        },
        error: (error) => this.handleError(error),
      });
  }

  onCancelEdit() {
    this.resetForm();
  }

  onClearForm() {
    this.resetForm();
  }

  onPageChange(page: number) {
    this.load(page);
  }

  onApplyFilters() {
    const values = this.filtersForm.getRawValue();
    const filters: InstitutionStudentFilters = {
      nombreCompleto: values.nombreCompleto?.trim() || undefined,
      dni: values.dni?.trim() || undefined,
    };
    this.filters.set(filters);
    this.load(0);
  }

  onResetFilters() {
    this.filtersForm.reset({
      nombreCompleto: '',
      dni: '',
    });
    this.filters.set({});
    this.load(0);
  }

  private resetForm() {
    this.form.reset({
      id: null,
      nombreCompleto: '',
      dni: '',
      nivel: '',
      grado: '',
      seccion: '',
      direccion: '',
      responsablePago: '',
      emailTutor: '',
      telefonoTutor: '',
    });
    this.editing.set(false);
  }

  private handleError(error: unknown) {
    let message = 'Ocurrió un error inesperado. Inténtelo nuevamente.';
    if (error instanceof HttpErrorResponse) {
      message =
        (error.error && (error.error.message || error.error.error)) ||
        error.message ||
        message;
    }
    this.feedback.set(message);
  }
}
