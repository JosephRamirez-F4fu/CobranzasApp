import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  InstitutionStudentAccountStatus,
  InstitutionStudentsService,
} from '../../../services/institution-students.service';
import {
  InstitutionAccountStatementDetail,
  InstitutionAccountStatementService,
} from '../../../services/institution-account-statement.service';
import {
  InstitutionEnrollmentSchedule,
  InstitutionEnrollmentSchedulesService,
} from '../../../services/institution-enrollment-schedules.service';

type EnrollmentFormGroup = FormGroup<{
  scheduleId: FormControl<number | null>;
  confirm: FormControl<boolean>;
}>;

@Component({
  selector: 'app-student-enrollments',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './studentEnrollments.component.html',
  host: {
    class: 'block min-h-full  p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StudentEnrollmentsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly studentsService = inject(InstitutionStudentsService);
  private readonly accountStatementService = inject(
    InstitutionAccountStatementService
  );
  private readonly enrollmentSchedulesService = inject(
    InstitutionEnrollmentSchedulesService
  );

  readonly loading = signal(false);
  readonly status = signal<InstitutionStudentAccountStatus | null>(null);
  readonly error = signal<string | null>(null);
  readonly studentId = signal<number | null>(null);
  readonly studentLevel = signal('');

  readonly schedulesLoading = signal(false);
  readonly schedulesError = signal<string | null>(null);
  readonly schedules = signal<InstitutionEnrollmentSchedule[]>([]);

  readonly scheduleDetailLoading = signal(false);
  readonly scheduleDetailError = signal<string | null>(null);
  readonly scheduleDetail = signal<InstitutionAccountStatementDetail | null>(
    null
  );

  readonly enrolling = signal(false);
  readonly enrollmentError = signal<string | null>(null);
  readonly enrollmentSuccess = signal<string | null>(null);

  readonly enrollmentForm: EnrollmentFormGroup = this.fb.group({
    scheduleId: this.fb.control<number | null>(null, {
      validators: [Validators.required],
    }),
    confirm: this.fb.nonNullable.control(false, {
      validators: [Validators.requiredTrue],
    }),
  });

  readonly eligibleSchedules = computed(() =>
    this.schedules().filter((schedule) => !this.isScheduleDisabled(schedule))
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const idParam = params.get('studentId');
      const id = idParam ? Number(idParam) : NaN;
      if (!Number.isNaN(id) && id > 0) {
        this.loadStatus(id);
      } else {
        this.status.set(null);
        this.resetStudentContext();
      }
    });

    this.enrollmentForm.controls.scheduleId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const scheduleId = typeof value === 'number' ? value : null;
        this.enrollmentError.set(null);
        this.enrollmentSuccess.set(null);
        if (!scheduleId) {
          this.scheduleDetail.set(null);
          this.scheduleDetailError.set(null);
          return;
        }
        this.loadScheduleDetail(scheduleId);
      });
  }

  private loadStatus(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.enrollmentError.set(null);
    this.studentsService
      .getAccountStatus(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.status.set(data);
          this.studentId.set(data.id);
          this.studentLevel.set(data.nivelAcademico || '');
          this.enrollmentForm.reset({
            scheduleId: null,
            confirm: false,
          });
          this.scheduleDetail.set(null);
          this.loadSchedules();
        },
        error: (error) => this.handleError(error),
      });
  }

  private loadSchedules() {
    if (!this.studentId()) {
      return;
    }
    this.schedulesLoading.set(true);
    this.schedulesError.set(null);
    this.enrollmentSchedulesService
      .list(0, 50, { activo: true })
      .pipe(finalize(() => this.schedulesLoading.set(false)))
      .subscribe({
        next: (response) => {
          const currentId = this.enrollmentForm.controls.scheduleId.value;
          const items = response.data.items;
          this.schedules.set(items);
          if (!items.some((schedule) => schedule.id === currentId)) {
            this.enrollmentForm.controls.scheduleId.setValue(null, {
              emitEvent: true,
            });
          }
        },
        error: (error) => this.handleSchedulesError(error),
      });
  }

  private loadScheduleDetail(scheduleId: number) {
    const studentId = this.studentId();
    if (!studentId) {
      return;
    }

    this.scheduleDetailLoading.set(true);
    this.scheduleDetailError.set(null);
    this.scheduleDetail.set(null);

    this.accountStatementService
      .getScheduleDetail(scheduleId, studentId)
      .pipe(finalize(() => this.scheduleDetailLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.scheduleDetail.set(response.data);
        },
        error: (error) => this.handleScheduleDetailError(error),
      });
  }

  onSubmitEnrollment() {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      return;
    }

    const studentId = this.studentId();
    const scheduleId = this.enrollmentForm.controls.scheduleId.value;

    if (!studentId || !scheduleId) {
      return;
    }

    this.enrollmentError.set(null);
    this.enrollmentSuccess.set(null);
    this.enrolling.set(true);

    this.accountStatementService
      .enrollStudent(scheduleId, studentId)
      .pipe(finalize(() => this.enrolling.set(false)))
      .subscribe({
        next: (response) => {
          this.enrollmentSuccess.set(
            response.message || 'La matrícula se registró correctamente.'
          );
          this.enrollmentForm.reset({
            scheduleId: null,
            confirm: false,
          });
          this.scheduleDetail.set(null);
          this.loadStatus(studentId);
        },
        error: (error) => this.handleEnrollmentError(error),
      });
  }

  isScheduleDisabled(schedule: InstitutionEnrollmentSchedule) {
    const level = this.studentLevel().trim();
    if (!level) {
      return false;
    }
    return (
      !!schedule.nivelEducativo && schedule.nivelEducativo.trim() !== level
    );
  }

  hasFieldError(controlName: keyof EnrollmentFormGroup['controls']) {
    const control = this.enrollmentForm.controls[controlName];
    return control.touched && control.invalid;
  }

  private handleError(error: unknown) {
    const message = this.extractErrorMessage(
      error,
      'No fue posible cargar las matrículas del alumno.'
    );
    this.error.set(message);
    this.status.set(null);
    this.resetStudentContext();
  }

  private handleSchedulesError(error: unknown) {
    const message = this.extractErrorMessage(
      error,
      'No fue posible obtener los cronogramas disponibles.'
    );
    this.schedulesError.set(message);
    this.schedules.set([]);
  }

  private handleScheduleDetailError(error: unknown) {
    const message = this.extractErrorMessage(
      error,
      'No fue posible obtener el detalle del cronograma seleccionado.'
    );
    this.scheduleDetailError.set(message);
    this.scheduleDetail.set(null);
  }

  private handleEnrollmentError(error: unknown) {
    const message = this.extractErrorMessage(
      error,
      'No fue posible matricular al alumno con el cronograma seleccionado.'
    );
    this.enrollmentError.set(message);
  }

  private extractErrorMessage(error: unknown, fallback: string) {
    if (error instanceof HttpErrorResponse) {
      return (
        (error.error && (error.error.message || error.error.error)) ||
        error.message ||
        fallback
      );
    }
    return fallback;
  }

  private resetStudentContext() {
    this.studentId.set(null);
    this.studentLevel.set('');
    this.schedules.set([]);
    this.schedulesError.set(null);
    this.scheduleDetail.set(null);
    this.scheduleDetailError.set(null);
    this.enrollmentForm.reset({
      scheduleId: null,
      confirm: false,
    });
    this.enrollmentSuccess.set(null);
    this.enrollmentError.set(null);
  }
}
