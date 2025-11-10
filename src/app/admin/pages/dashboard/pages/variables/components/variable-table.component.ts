import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Variable } from '@services/variable.service';

@Component({
  selector: 'variable-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Variables registradas
          </p>
          <h2 class="text-xl font-semibold text-white">Listado</h2>
        </div>
        <span
          class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
          *ngIf="!loading"
        >
          {{ variables.length }} resultados
        </span>
      </header>

      <div class="overflow-auto rounded border border-white/5">
        <table class="min-w-full text-sm text-slate-200">
          <thead class="bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th class="px-4 py-2 text-left">Nombre</th>
              <th class="px-4 py-2 text-left">Descripción</th>
              <th class="px-4 py-2 text-left">Tipo</th>
              <th class="px-4 py-2 text-left">Estado</th>
              <th class="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="5" class="px-4 py-6 text-center text-slate-400">
                Cargando variables...
              </td>
            </tr>
            <tr *ngIf="!loading && variables.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-slate-400">
                No se encontraron variables con los filtros aplicados.
              </td>
            </tr>
            <tr
              *ngFor="let variable of variables"
              class="border-t border-white/5"
            >
              <td class="px-4 py-3 font-semibold text-white">
                {{ variable.nombre }}
              </td>
              <td class="px-4 py-3 text-slate-300">
                {{ variable.descripcion || 'Sin descripción' }}
              </td>
              <td class="px-4 py-3 text-slate-200">#{{ variable.tipo }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  [class.bg-emerald-500]="variable.activo"
                  [class.text-emerald-300]="variable.activo"
                  [class.bg-rose-500]="!variable.activo"
                  [class.text-rose-200]="!variable.activo"
                >
                  {{ variable.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="mr-2 text-sm text-emerald-400 hover:text-emerald-200"
                  (click)="edit.emit(variable)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="text-sm text-rose-400 hover:text-rose-200"
                  (click)="del.emit(variable.id!)"
                  [disabled]="variable.id == null"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer
        class="mt-4 flex items-center justify-between text-sm text-slate-300"
      >
        <span>Página {{ page }} de {{ totalPages }}</span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded border border-white/10 px-3 py-1 disabled:opacity-40"
            [disabled]="page <= 1"
            (click)="pageChange.emit(page - 1)"
          >
            Anterior
          </button>
          <button
            type="button"
            class="rounded border border-white/10 px-3 py-1 disabled:opacity-40"
            [disabled]="page >= totalPages"
            (click)="pageChange.emit(page + 1)"
          >
            Siguiente
          </button>
        </div>
      </footer>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariableTableComponent {
  @Input() variables: Variable[] = [];
  @Input() loading = false;
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Variable>();
  @Output() del = new EventEmitter<number>();
}
