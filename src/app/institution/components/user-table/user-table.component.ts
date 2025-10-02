import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionUser } from '../../services/institution-users.service';

@Component({
  selector: 'app-institution-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionUserTableComponent {
  @Input() users: InstitutionUser[] = [];
  @Input() loading = false;
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() totalItems = 0;

  @Output() edit = new EventEmitter<InstitutionUser>();
  @Output() deactivate = new EventEmitter<InstitutionUser>();
  @Output() remove = new EventEmitter<InstitutionUser>();
  @Output() pageChange = new EventEmitter<number>();

  readonly trackById = (_: number, item: InstitutionUser) => item.id;

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
