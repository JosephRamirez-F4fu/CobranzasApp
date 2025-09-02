import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { LoginErrorComponent } from '../login-error/login-error.component';

interface LoginForm {
  email: string;
  password: string;
}

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
  loginOutput = output<LoginForm>();
  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginOutput.emit(this.loginForm.value as LoginForm);
    }
  }
}
