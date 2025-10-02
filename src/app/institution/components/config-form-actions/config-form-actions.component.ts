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
    <div class="flex flex-wrap items-center gap-3">
      <button
        *ngIf="!editing"
        type="button"
        class="inline-flex items-center justify-center rounded-xl border border-sky-600 bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
        (click)="edit.emit()"
      >
        {{ editLabel }}
      </button>

      <ng-container *ngIf="editing">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          [disabled]="saving || disableSave"
        >
          {{ saving ? savingLabel : saveLabel }}
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          (click)="cancel.emit()"
        >
          {{ cancelLabel }}
        </button>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
