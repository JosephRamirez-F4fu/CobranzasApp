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
  selector: 'app-institution-enrollment-schedule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment-schedule-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionEnrollmentScheduleFormComponent {
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
