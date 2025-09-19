import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginDto } from '@domain/dtos/login.dto';
import { FormUtils } from '@utils/form-utils';
import { LoginErrorComponent } from '../login-error/login-error.component';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, LoginErrorComponent],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  loginOutput = output<LoginDto>();
  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginOutput.emit({
        nombreUsuario: this.loginForm.value.email ?? '',
        contrasena: this.loginForm.value.password ?? '',
        institutionCode: null,
      });
    }
  }
}
