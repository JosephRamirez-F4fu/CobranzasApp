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
    <div class="flex gap-3">
      <button
        *ngIf="!editing"
        type="button"
        class="px-4 py-2 bg-sky-600 text-white rounded text-sm hover:bg-sky-700"
        (click)="edit.emit()"
      >
        {{ editLabel }}
      </button>

      <ng-container *ngIf="editing">
        <button
          type="submit"
          class="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
          [disabled]="saving || disableSave"
        >
          {{ saving ? savingLabel : saveLabel }}
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
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
