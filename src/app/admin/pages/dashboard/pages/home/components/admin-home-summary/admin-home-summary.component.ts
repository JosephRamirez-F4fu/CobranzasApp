import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface AdminHomeSummaryCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'admin-home-summary',
  standalone: true,
  template: `
    <div class="max-w-3xl mt-8 p-8 bg-white rounded-xl">
      <h1 class="text-3xl font-bold text-blue-800 mb-4">{{ title() }}</h1>
      <p class="text-lg text-gray-700 mb-6">{{ description() }}</p>
      <div class="grid md:grid-cols-3 gap-6">
        @for (card of cards(); track card.title) {
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">{{ card.icon }}</div>
            <div class="font-semibold text-blue-700">{{ card.title }}</div>
            <div class="text-sm text-gray-500">{{ card.description }}</div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeSummaryComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly cards = input.required<AdminHomeSummaryCard[]>();
}
