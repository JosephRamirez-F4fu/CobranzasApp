import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactFormPayload } from '../../landing-page.service';

@Component({
  selector: 'contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  companyEmail = input.required<string>();
  loading = input.required<boolean>();
  sent = input.required<boolean>();
  submitForm = output<ContactFormPayload>();
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    institucion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.sent()) {
        this.form.reset();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { nombre, institucion, email, mensaje } = this.form.getRawValue();
    const payload: ContactFormPayload = {
      nombre,
      institucion,
      email,
      mensaje,
    };

    this.submitForm.emit(payload);
  }
}
