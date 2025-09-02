import { Component, input } from '@angular/core';

@Component({
  selector: 'login-error',
  imports: [],
  templateUrl: './login-error.component.html',
})
export class LoginErrorComponent {
  errorMessage = input.required<string | null>();
  hasError = input.required<boolean | null>();
}
