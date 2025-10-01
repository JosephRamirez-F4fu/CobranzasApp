import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'auth-not-found-message',
  standalone: true,
  template: `
    <div class="max-w-lg mx-auto text-center space-y-4">
      <h1 class="text-3xl font-bold text-blue-800">{{ title() }}</h1>
      <p class="text-gray-600">{{ description() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthNotFoundMessageComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
