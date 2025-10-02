import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="mx-auto w-full rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur"
      [ngClass]="[maxWidthClass, containerClass]"
    >
      <header class="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
        <p *ngIf="description" class="text-sm text-slate-500 leading-relaxed">
          {{ description }}
        </p>
      </header>
      <div class="pt-6">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigSectionComponent {
  @Input({ required: true }) title!: string;
  @Input() description = '';
  @Input() maxWidthClass = 'max-w-3xl';
  @Input() containerClass = '';
}
