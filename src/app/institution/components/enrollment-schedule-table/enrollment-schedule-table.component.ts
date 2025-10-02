import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitutionEnrollmentSchedule } from '../../services/institution-enrollment-schedules.service';

@Component({
  selector: 'app-institution-enrollment-schedule-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-schedule-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionEnrollmentScheduleTableComponent {
  @Input() schedules: InstitutionEnrollmentSchedule[] = [];
  @Input() loading = false;
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() totalItems = 0;

  @Output() edit = new EventEmitter<InstitutionEnrollmentSchedule>();
  @Output() remove = new EventEmitter<InstitutionEnrollmentSchedule>();
  @Output() editQuota = new EventEmitter<InstitutionEnrollmentSchedule>();
  @Output() pageChange = new EventEmitter<number>();

  readonly trackById = (
    _: number,
    schedule: InstitutionEnrollmentSchedule
  ) => schedule.id;

  onPrevious() {
    if (this.page > 0) {
      this.pageChange.emit(this.page - 1);
    }
  }

  onNext() {
    if (this.page < this.totalPages - 1) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
