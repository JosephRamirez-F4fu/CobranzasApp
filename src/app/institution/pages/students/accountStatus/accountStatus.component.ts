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
  selector: 'app-account-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accountStatus.component.html',
  host: {
    class: 'block min-h-full bg-slate-100 p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountStatusComponent {
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
    let message = 'No fue posible cargar la información del alumno.';
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
