import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistrarInstitucionFacade } from '../../data-access/registrar-institucion.facade';

@Component({
  selector: 'app-registrar-institucion-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-institucion.page.html',
})
export class RegistrarInstitucionPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(RegistrarInstitucionFacade);

  readonly form = this.fb.nonNullable.group({
    institucion_nombre: ['', Validators.required],
    institucion_direccion: ['', Validators.required],
    institucion_telefono: ['', Validators.required],
    plan: ['estandar', Validators.required],
    admin_nombre: ['', Validators.required],
    admin_email: ['', [Validators.required, Validators.email]],
    admin_password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly isSubmitting = computed(() => this.facade.status() === 'loading');
  readonly errorMessage = this.facade.errorMessage;

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.registrar(this.form.getRawValue());
  }
}
