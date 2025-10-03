import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InstitutionStudent } from '../../services/institution-students.service';

@Component({
  selector: 'app-institution-student-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class InstitutionStudentTableComponent {
  @Input() students: InstitutionStudent[] = [];
  @Input() loading = false;
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() totalItems = 0;

  @Output() edit = new EventEmitter<InstitutionStudent>();
  @Output() remove = new EventEmitter<InstitutionStudent>();
  @Output() pageChange = new EventEmitter<number>();

  readonly trackById = (_: number, item: InstitutionStudent) => item.id;

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
