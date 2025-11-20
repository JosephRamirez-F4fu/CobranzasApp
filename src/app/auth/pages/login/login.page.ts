import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginFacade } from '../../data-access/login.facade';
import { SocialLoginButtonsComponent } from '../../components/social-login-buttons/social-login-buttons.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SocialLoginButtonsComponent],
  templateUrl: './login.page.html',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(LoginFacade);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly isSubmitting = computed(() => this.facade.status() === 'loading');
  readonly errorMessage = this.facade.errorMessage;

  submit() {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.login(this.form.getRawValue());
  }
}
