import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import {
  InstitutionStudentAccountStatus,
  InstitutionStudentsService,
} from '../../../services/institution-students.service';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paymentHistory.component.html',
  host: {
    class: 'block min-h-full bg-slate-100 p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaymentHistoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly studentsService = inject(InstitutionStudentsService);

  readonly loading = signal(false);
  readonly status = signal<InstitutionStudentAccountStatus | null>(null);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const idParam = params.get('studentId');
        const id = idParam ? Number(idParam) : NaN;
        if (!Number.isNaN(id) && id > 0) {
          this.loadStatus(id);
        } else {
          this.status.set(null);
        }
      });
  }

  get sortedPayments() {
    const data = this.status();
    if (!data) {
      return [];
    }
    return data.matriculas
      .flatMap((enrollment) =>
        enrollment.pagos.map((payment) => ({
          ...payment,
          periodoAcademico: enrollment.periodoAcademico,
          matriculaId: enrollment.id,
        }))
      )
      .sort((a, b) => {
        const dateA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
        const dateB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
        return dateB - dateA;
      });
  }

  private loadStatus(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.studentsService
      .getAccountStatus(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.status.set(response.data);
        },
        error: (error) => this.handleError(error),
      });
  }

  private handleError(error: unknown) {
    let message = 'No fue posible cargar el historial de pagos.';
    if (error instanceof HttpErrorResponse) {
      message =
        (error.error && (error.error.message || error.error.error)) ||
        error.message ||
        message;
    }
    this.error.set(message);
    this.status.set(null);
  }
}
