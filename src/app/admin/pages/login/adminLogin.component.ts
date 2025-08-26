import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginDto } from './interfaces/login.dto';
import { CommonModule } from '@angular/common';
import { AdminLoginService } from './services/admin-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adminLogin.component.html',
})
export class AdminLoginComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', Validators.required),
  });

  loginService = inject(AdminLoginService);
  router = inject(Router);
  loading = signal(false);
  error = signal('');
  success = signal(false);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.success.set(false);
    this.loginService
      .login({
        nombreUsuario: this.form.value.email!,
        contrasena: this.form.value.password!,
      } as LoginDto)
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.success.set(true);
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Credenciales incorrectas o error de red.');
        },
      });
  }
}
