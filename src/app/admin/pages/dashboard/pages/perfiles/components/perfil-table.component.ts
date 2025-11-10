import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Perfil } from '@services/perfiles.service';

@Component({
  selector: 'perfil-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Perfiles registrados
          </p>
          <h2 class="text-xl font-semibold text-white">Listado</h2>
        </div>
        <span
          class="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
          *ngIf="!loading"
        >
          {{ perfiles.length }} resultados
        </span>
      </header>

      <div class="overflow-auto rounded border border-white/5">
        <table class="min-w-full text-sm text-slate-200">
          <thead class="bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th class="px-4 py-2 text-left">Nombre</th>
              <th class="px-4 py-2 text-left">Descripción</th>
              <th class="px-4 py-2 text-left">Score</th>
              <th class="px-4 py-2 text-left">Estado</th>
              <th class="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="5" class="px-4 py-6 text-center text-slate-400">
                Cargando perfiles...
              </td>
            </tr>
            <tr *ngIf="!loading && perfiles.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-slate-400">
                No se encontraron perfiles con los filtros aplicados.
              </td>
            </tr>
            <tr *ngFor="let perfil of perfiles" class="border-t border-white/5">
              <td class="px-4 py-3 font-semibold text-white">
                {{ perfil.nombre }}
              </td>
              <td class="px-4 py-3 text-slate-300">
                {{ perfil.descripcion || 'Sin descripción' }}
              </td>
              <td class="px-4 py-3 text-slate-200">
                {{ perfil.minScore }} - {{ perfil.maxScore }}
              </td>
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  [class.bg-emerald-500]="perfil.activo"
                  [class.text-emerald-300]="perfil.activo"
                  [class.bg-rose-500]="!perfil.activo"
                  [class.text-rose-200]="!perfil.activo"
                  (click)="toggleStatus.emit(perfil)"
                >
                  {{ perfil.activo ? 'Activo' : 'Inactivo' }}
                </button>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="mr-2 text-sm text-cyan-400 hover:text-cyan-200"
                  (click)="edit.emit(perfil)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="text-sm text-rose-400 hover:text-rose-200"
                  (click)="del.emit(perfil.id!)"
                  [disabled]="perfil.id == null"
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
export class PerfilTableComponent {
  @Input() perfiles: Perfil[] = [];
  @Input() loading = false;
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() edit = new EventEmitter<Perfil>();
  @Output() del = new EventEmitter<number>();
  @Output() toggleStatus = new EventEmitter<Perfil>();
  @Output() pageChange = new EventEmitter<number>();
}
