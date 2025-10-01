import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'admin-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login-form.component.html',
})
export class AdminLoginFormComponent {
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  private readonly fb = new FormBuilder();
  readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', Validators.required),
  });

  @Output() submitCredentials = new EventEmitter<{
    email: string;
    password: string;
  }>();

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitCredentials.emit({
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    });
  }
}
