import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  PaginationMeta,
  ScoringLog,
} from '@services/scoring.service';

@Component({
  selector: 'scoring-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <section class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
      <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-amber-400">Logs de scoring</p>
          <h2 class="text-xl font-semibold text-white">Historial</h2>
        </div>
        <button
          type="button"
          class="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
          (click)="export.emit()"
          [disabled]="exporting || loading"
        >
          {{ exporting ? 'Generando...' : 'Exportar' }}
        </button>
      </header>

      <div class="overflow-auto rounded border border-white/5">
        <table class="min-w-full text-sm text-slate-200">
          <thead class="bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th class="px-4 py-2 text-left">Perfil</th>
              <th class="px-4 py-2 text-left">Cuenta</th>
              <th class="px-4 py-2 text-left">Score</th>
              <th class="px-4 py-2 text-left">Fecha cálculo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="4" class="px-4 py-6 text-center text-slate-400">
                Cargando logs...
              </td>
            </tr>
            <tr *ngIf="!loading && logs.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-slate-400">
                No se encontraron registros para los filtros dados.
              </td>
            </tr>
            <tr *ngFor="let log of logs" class="border-t border-white/5">
              <td class="px-4 py-3 font-semibold text-white">{{ log.perfil }}</td>
              <td class="px-4 py-3 text-slate-300">{{ log.cuenta }}</td>
              <td class="px-4 py-3 text-amber-300 font-semibold">{{ log.score }}</td>
              <td class="px-4 py-3 text-slate-200">
                {{ log.fechaCalculo | date: 'medium' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded border border-white/10 px-3 py-1 disabled:opacity-40"
            [disabled]="currentPage <= 1"
            (click)="changePage(currentPage - 1)"
          >
            Anterior
          </button>
          <button
            type="button"
            class="rounded border border-white/10 px-3 py-1 disabled:opacity-40"
            [disabled]="currentPage >= totalPages"
            (click)="changePage(currentPage + 1)"
          >
            Siguiente
          </button>
        </div>
      </footer>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoringTableComponent {
  @Input() logs: ScoringLog[] = [];
  @Input() loading = false;
  @Input() exporting = false;
  @Input() pagination: PaginationMeta | null = null;
  @Output() pageChange = new EventEmitter<number>();
  @Output() export = new EventEmitter<void>();

  get currentPage() {
    return this.pagination?.currentPage ?? 1;
  }

  get totalPages() {
    return this.pagination?.totalPages ?? 1;
  }

  changePage(nextPage: number) {
    if (nextPage < 1) {
      return;
    }
    if (nextPage > this.totalPages) {
      return;
    }
    this.pageChange.emit(nextPage);
  }
}
