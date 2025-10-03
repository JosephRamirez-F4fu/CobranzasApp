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
    <section
      class="space-y-6 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-8"
    >
      <div class="space-y-3">
        <h1 class="text-3xl font-semibold text-white md:text-4xl">{{ title() }}</h1>
        <p class="text-sm text-slate-300 md:text-base">{{ description() }}</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (card of cards(); track card.title) {
          <article
            class="flex flex-col items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/60 p-5 text-center shadow-lg shadow-slate-950/30"
          >
            <div class="text-4xl">{{ card.icon }}</div>
            <h3 class="text-base font-semibold text-white">{{ card.title }}</h3>
            <p class="text-sm text-slate-300">{{ card.description }}</p>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeSummaryComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly cards = input.required<AdminHomeSummaryCard[]>();
}
