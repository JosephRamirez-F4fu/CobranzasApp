import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full" [ngClass]="[maxWidthClass, containerClass]">
      <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
      <p *ngIf="description" class="text-sm text-gray-500 mb-4">
        {{ description }}
      </p>
      <ng-content></ng-content>
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
