import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="mx-auto w-full rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6 text-slate-100 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
      [ngClass]="[maxWidthClass, containerClass]"
    >
      <header class="flex flex-col gap-2 border-b border-slate-700/70 pb-4">
        <h2 class="text-xl font-semibold text-white">{{ title }}</h2>
        <p *ngIf="description" class="text-sm leading-relaxed text-slate-300">
          {{ description }}
        </p>
      </header>
      <div class="pt-6">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class ConfigSectionComponent {
  @Input({ required: true }) title!: string;
  @Input() description = '';
  @Input() maxWidthClass = 'max-w-3xl';
  @Input() containerClass = '';
}
