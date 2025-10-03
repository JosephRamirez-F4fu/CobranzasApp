import { Component, input, output } from '@angular/core';
import { User } from '@services/user.service';
import { Institution } from '@domain/interface/institution';

@Component({
  selector: 'user-table',
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
              <th class="py-3 pr-4">Nombre</th>
              <th class="py-3 pr-4">Email</th>
              <th class="py-3 pr-4">Rol</th>
              <th class="py-3 pr-4">Institución</th>
              <th class="py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user) {
              <tr class="border-b border-slate-800/60 transition hover:bg-slate-900/60">
                <td class="py-3 pr-4 font-semibold text-white">{{ user.nombreCompleto }}</td>
                <td class="py-3 pr-4">{{ user.correo }}</td>
                <td class="py-3 pr-4">
                  <span
                    class="inline-flex items-center rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200"
                  >
                    {{ user.rol }}
                  </span>
                </td>
                <td class="py-3 pr-4">{{ institutionName(user.institutionId) }}</td>
                <td class="py-3">
                  <div class="flex flex-wrap items-center justify-center gap-2">
                    <button
                      (click)="edit.emit({ id: user.id!, user })"
                      class="inline-flex items-center rounded-full border border-emerald-400/50 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      Editar
                    </button>
                    <button
                      (click)="del.emit(user.id!)"
                      class="inline-flex items-center rounded-full border border-rose-500/50 px-4 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="py-8 text-center text-sm text-slate-400">
                  No hay usuarios registrados
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span>Página {{ page() }} de {{ totalPages() }}</span>
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
})
export class UserTableComponent {
  users = input.required<User[]>();
  edit = output<{ id: number; user: User }>();
  del = output<number>();
  page = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();
  institutions = input.required<Institution[]>();

  nextPage() {
    if (this.page() < this.totalPages()) this.pageChange.emit(this.page() + 1);
  }
  prevPage() {
    if (this.page() > 1) this.pageChange.emit(this.page() - 1);
  }

  institutionName(id: number | null) {
    return (
      this.institutions()
        .find((inst) => inst.id === id)
        ?.name.toLocaleUpperCase() || '-'
    );
  }
}
