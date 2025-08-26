import { Component, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  companyEmail = input.required<string>();
  loading = signal(false);
  sent = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      institucion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { nombre, institucion, email, mensaje } = this.form.value;
    const subject = encodeURIComponent('Consulta desde landing');
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nInstitución: ${institucion}\nCorreo: ${email}\nMensaje: ${mensaje}`
    );
    window.location.href = `mailto:${this.companyEmail()}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
    }, 1000);
  }
}
