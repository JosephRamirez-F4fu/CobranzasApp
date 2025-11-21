import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmarAdminFacade } from '../../data-access/confirmar-admin.facade';

@Component({
  selector: 'app-confirmar-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirmar-admin.page.html',
})
export class ConfirmarAdminPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(ConfirmarAdminFacade);

  readonly form = this.fb.nonNullable.group({
    institucion_id: [0, Validators.required],
    institucion_token: ['', Validators.required],
    admin_email: ['', [Validators.required, Validators.email]],
    admin_token: ['', Validators.required],
  });

  readonly isSubmitting = computed(() => this.facade.status() === 'loading');
  readonly errorMessage = this.facade.errorMessage;

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.confirmar(this.form.getRawValue());
  }
}
