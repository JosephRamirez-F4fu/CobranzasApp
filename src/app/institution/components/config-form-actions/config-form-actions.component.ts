import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-form-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-center gap-3 text-slate-100">
      <button
        *ngIf="!editing"
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        (click)="edit.emit()"
      >
        {{ editLabel }}
      </button>

      <ng-container *ngIf="editing">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
          [disabled]="saving || disableSave"
        >
          {{ saving ? savingLabel : saveLabel }}
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/60 px-5 py-2 text-sm font-semibold text-slate-200 shadow-inner shadow-slate-950/40 transition hover:border-rose-400 hover:bg-rose-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-400/30"
          (click)="cancel.emit()"
        >
          {{ cancelLabel }}
        </button>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class ConfigFormActionsComponent {
  @Input() editing = false;
  @Input() saving = false;
  @Input() disableSave = false;
  @Input() editLabel = 'Editar';
  @Input() saveLabel = 'Guardar';
  @Input() savingLabel = 'Guardando...';
  @Input() cancelLabel = 'Cancelar';

  @Output() edit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
