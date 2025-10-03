import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-institution-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class InstitutionStudentFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() saving = false;
  @Input() editing = false;
  @Output() submitted = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  @Output() cleared = new EventEmitter<void>();

  onSubmit() {
    this.submitted.emit();
  }

  onCancel() {
    this.canceled.emit();
  }

  onClear() {
    this.cleared.emit();
  }
}
