import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InstitutionForCreate } from '@services/institutions.service';
import { INSTITUTION_PLAN_LABELS } from '@domain/enums/institution-plan.enum';

@Component({
  selector: 'institution-table',
  standalone: true,
  imports: [],
  template: `
    <div
      class="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full table-auto text-left text-sm text-slate-200">
          <thead class="text-xs uppercase tracking-[0.25em] text-slate-400">
            <tr class="border-b border-slate-700/60">
              <th class="py-3 pr-4">Codigo</th>
              <th class="py-3 pr-4">Nombre</th>
              <th class="py-3 pr-4">Plan</th>
              <th class="py-3 pr-4">Email</th>
              <th class="py-3 pr-4">Telefono</th>
              <th class="py-3 pr-4">Direccion</th>
              <th class="py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (inst of institutions(); track inst) {
              <tr class="border-b border-slate-800/60 transition hover:bg-slate-900/60">
                <td class="py-3 pr-4 font-semibold text-white">{{ inst.code || 'No asignado' }}</td>
                <td class="py-3 pr-4">{{ inst.name }}</td>
                <td class="py-3 pr-4">
                  {{ inst.plan ? planLabels[inst.plan] : 'Sin plan' }}
                </td>
                <td class="py-3 pr-4">{{ inst.email }}</td>
                <td class="py-3 pr-4">{{ inst.phoneNumber }}</td>
                <td class="py-3 pr-4">{{ inst.address }}</td>
                <td class="py-3">
                  <div class="flex flex-wrap items-center justify-center gap-2">
                    <button
                      (click)="edit.emit({ id: inst.id!, institution: inst })"
                      class="inline-flex items-center rounded-full border border-emerald-400/50 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      Editar
                    </button>
                    <button
                      (click)="del.emit(inst.id!)"
                      class="inline-flex items-center rounded-full border border-rose-500/50 px-4 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="py-8 text-center text-sm text-slate-400">
                  No hay instituciones registradas
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span>Pagina {{ page() }} de {{ totalPages() }}</span>
        <div class="flex items-center gap-2">
          <button
            (click)="prevPage()"
            [disabled]="page() === 1"
            class="inline-flex items-center rounded-full border border-slate-600/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            (click)="nextPage()"
            [disabled]="page() === totalPages()"
            class="inline-flex items-center rounded-full border border-slate-600/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class InstitutionTableComponent {
  institutions = input.required<InstitutionForCreate[]>();

  edit = output<{ id: number; institution: InstitutionForCreate }>();
  del = output<number>();

  page = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  readonly planLabels = INSTITUTION_PLAN_LABELS;

  nextPage() {
    if (this.page() < this.totalPages()) this.pageChange.emit(this.page() + 1);
  }
  prevPage() {
    if (this.page() > 1) this.pageChange.emit(this.page() - 1);
  }
}
