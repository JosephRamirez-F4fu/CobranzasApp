import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
  InstitutionEnrollmentLevel,
  InstitutionEnrollmentSchedule,
  InstitutionEnrollmentScheduleFilters,
  InstitutionEnrollmentSchedulePayload,
  InstitutionEnrollmentSchedulesService,
} from '../../services/institution-enrollment-schedules.service';
import { InstitutionEnrollmentScheduleFormComponent } from '../../components/enrollment-schedule-form/enrollment-schedule-form.component';
import { InstitutionEnrollmentScheduleTableComponent } from '../../components/enrollment-schedule-table/enrollment-schedule-table.component';

interface InstitutionEnrollmentScheduleFormValue
  extends InstitutionEnrollmentSchedulePayload {
  id: number | null;
}

type InstitutionEnrollmentScheduleFormGroup = FormGroup<{
  id: FormControl<number | null>;
  anioLectivo: FormControl<number | null>;
  nivelEducativo: FormControl<string>;
  montoCuota: FormControl<number | null>;
  numCuotas: FormControl<number | null>;
  interesMoraCuota: FormControl<number | null>;
  fechaInicio: FormControl<string>;
  activo: FormControl<boolean>;
}>;

type InstitutionEnrollmentScheduleFiltersFormGroup = FormGroup<{
  anioLectivo: FormControl<string>;
  nivelEducativo: FormControl<string>;
  activo: FormControl<string>;
}>;

type InstitutionEnrollmentQuotaFormGroup = FormGroup<{
  scheduleId: FormControl<number | null>;
  monto: FormControl<number | null>;
  fechaVencimiento: FormControl<string>;
}>;

@Component({
  selector: 'app-enrollment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InstitutionEnrollmentScheduleFormComponent,
    InstitutionEnrollmentScheduleTableComponent,
  ],
  templateUrl: './enrollmentSchedule.component.html',
  host: {
    class: 'block min-h-full bg-slate-100 p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnrollmentScheduleComponent {
  private readonly fb = inject(FormBuilder);
  private readonly schedulesService = inject(
    InstitutionEnrollmentSchedulesService
  );

  readonly schedules = signal<InstitutionEnrollmentSchedule[]>([]);
  readonly totalPages = signal(0);
  readonly totalItems = signal(0);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly quotaSaving = signal(false);
  readonly page = signal(0);
  readonly editing = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly selectedQuotaSchedule = signal<
    InstitutionEnrollmentSchedule | null
  >(null);

  readonly levels: InstitutionEnrollmentLevel[] = [
    'INICIAL',
    'PRIMARIA',
    'SECUNDARIA',
  ];

  readonly form: InstitutionEnrollmentScheduleFormGroup = this.fb.group({
    id: this.fb.control<number | null>(null),
    anioLectivo: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(2000)],
    }),
    nivelEducativo: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    montoCuota: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    numCuotas: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    interesMoraCuota: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    fechaInicio: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    activo: this.fb.nonNullable.control(true),
  });

  readonly filtersForm: InstitutionEnrollmentScheduleFiltersFormGroup =
    this.fb.group({
      anioLectivo: this.fb.nonNullable.control(''),
      nivelEducativo: this.fb.nonNullable.control(''),
      activo: this.fb.nonNullable.control(''),
    });

  readonly quotaForm: InstitutionEnrollmentQuotaFormGroup = this.fb.group({
    scheduleId: this.fb.control<number | null>(null),
    monto: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    fechaVencimiento: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
  });

  private readonly pageSize = 10;
  private readonly filters = signal<InstitutionEnrollmentScheduleFilters>({});

  constructor() {
    this.load();
  }

  load(page = this.page()) {
    this.loading.set(true);
    this.schedulesService
      .list(page, this.pageSize, this.filters())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.schedules.set(response.data.items);
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

    const value = this.form.getRawValue() as InstitutionEnrollmentScheduleFormValue;
    const payload: InstitutionEnrollmentSchedulePayload = {
      anioLectivo: Number(value.anioLectivo ?? 0),
      nivelEducativo: value
        .nivelEducativo as InstitutionEnrollmentLevel,
      montoCuota: Number(value.montoCuota ?? 0),
      numCuotas: Number(value.numCuotas ?? 0),
      interesMoraCuota: Number(value.interesMoraCuota ?? 0),
      fechaInicio: value.fechaInicio,
      activo: value.activo ?? false,
    };

    this.saving.set(true);
    const request$ = value.id
      ? this.schedulesService.update(value.id, payload)
      : this.schedulesService.create(payload);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(
            response.message || 'Operación completada correctamente.'
          );
          const wasEditing = Boolean(value.id);
          this.resetForm();
          this.load(wasEditing ? this.page() : 0);
        },
        error: (error) => this.handleError(error),
      });
  }

  onEdit(schedule: InstitutionEnrollmentSchedule) {
    this.form.reset({
      id: schedule.id,
      anioLectivo: schedule.anioLectivo,
      nivelEducativo: schedule.nivelEducativo || '',
      montoCuota: schedule.montoCuota,
      numCuotas: schedule.numCuotas,
      interesMoraCuota: schedule.interesMoraCuota,
      fechaInicio: schedule.fechaInicio || '',
      activo: schedule.activo,
    });
    this.editing.set(true);
  }

  onDelete(schedule: InstitutionEnrollmentSchedule) {
    if (
      !confirm(
        `Esta acción eliminará el cronograma ${schedule.anioLectivo} - ${schedule.nivelEducativo}. ¿Desea continuar?`
      )
    ) {
      return;
    }

    this.saving.set(true);
    this.schedulesService
      .remove(schedule.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(
            response.message || 'Cronograma eliminado correctamente.'
          );
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
    const filters: InstitutionEnrollmentScheduleFilters = {};

    if (values.anioLectivo) {
      filters.anioLectivo = Number(values.anioLectivo);
    }

    if (values.nivelEducativo) {
      filters.nivelEducativo =
        values.nivelEducativo as InstitutionEnrollmentLevel;
    }

    if (values.activo === 'true') {
      filters.activo = true;
    } else if (values.activo === 'false') {
      filters.activo = false;
    }

    this.filters.set(filters);
    this.load(0);
  }

  onResetFilters() {
    this.filtersForm.reset({
      anioLectivo: '',
      nivelEducativo: '',
      activo: '',
    });
    this.filters.set({});
    this.load(0);
  }

  onEditQuota(schedule: InstitutionEnrollmentSchedule) {
    this.quotaForm.reset({
      scheduleId: schedule.id,
      monto: schedule.montoCuota,
      fechaVencimiento: schedule.fechaVencimiento || '',
    });
    this.selectedQuotaSchedule.set(schedule);
  }

  onCancelQuotaEdit() {
    this.resetQuotaForm();
  }

  onSubmitQuota() {
    if (this.quotaForm.invalid) {
      this.quotaForm.markAllAsTouched();
      return;
    }

    const value = this.quotaForm.getRawValue();
    if (!value.scheduleId) {
      return;
    }

    this.quotaSaving.set(true);
    this.schedulesService
      .updateQuota(value.scheduleId, {
        monto: Number(value.monto ?? 0),
        fechaVencimiento: value.fechaVencimiento,
      })
      .pipe(finalize(() => this.quotaSaving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(
            response.message || 'Cuota actualizada correctamente.'
          );
          this.resetQuotaForm();
          this.load(this.page());
        },
        error: (error) => this.handleError(error),
      });
  }

  private resetForm() {
    this.form.reset({
      id: null,
      anioLectivo: null,
      nivelEducativo: '',
      montoCuota: null,
      numCuotas: null,
      interesMoraCuota: null,
      fechaInicio: '',
      activo: true,
    });
    this.editing.set(false);
  }

  private resetQuotaForm() {
    this.quotaForm.reset({
      scheduleId: null,
      monto: null,
      fechaVencimiento: '',
    });
    this.selectedQuotaSchedule.set(null);
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
