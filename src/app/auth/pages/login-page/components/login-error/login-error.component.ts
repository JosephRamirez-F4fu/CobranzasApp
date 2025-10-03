import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'login-error',
  standalone: true,
  imports: [],
  templateUrl: './login-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-xs text-slate-200',
  },
})
export class LoginErrorComponent {
  errorMessage = input.required<string | null>();
  hasError = input.required<boolean | null>();
}
