import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { Institution } from '../institutions.component';

@Component({
  selector: 'institution-table',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-white rounded-xl shadow p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2">Código</th>
            <th class="py-2">Nombre</th>
            <th class="py-2">Email</th>
            <th class="py-2">Teléfono</th>
            <th class="py-2">Dirección</th>
            <th class="py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for ( inst of pagedInstitutions(); track inst) {
          <tr class="border-b hover:bg-blue-50">
            <td class="py-2">{{ inst.codigo }}</td>
            <td class="py-2">{{ inst.nombre }}</td>
            <td class="py-2">{{ inst.email }}</td>
            <td class="py-2">{{ inst.telefono }}</td>
            <td class="py-2">{{ inst.direccion }}</td>
            <td class="py-2 flex gap-2 justify-center">
              <button
                (click)="
                  edit.emit({
                    index: pagedInstitutions().indexOf(inst) + (page - 1) * pageSize,
                    institution: inst,
                  })
                "
                class="px-2 py-1 bg-yellow-400 text-xs rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                (click)="
                  del.emit(
                    pagedInstitutions().indexOf(inst) + (page - 1) * pageSize
                  )
                "
                class="px-2 py-1 bg-red-500 text-xs text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
          } @empty{
          <tr>
            <td colspan="5" class="py-2 text-center">
              No hay instituciones registradas
            </td>
          </tr>
          }
        </tbody>
      </table>
      <div class="flex justify-end gap-2 mt-4">
        <button
          (click)="prevPage()"
          [disabled]="page === 1"
          class="px-3 py-1 rounded bg-gray-200"
        >
          Anterior
        </button>
        <span>Página {{ page }} de {{ totalPages }}</span>
        <button
          (click)="nextPage()"
          [disabled]="page === totalPages"
          class="px-3 py-1 rounded bg-gray-200"
        >
          Siguiente
        </button>
      </div>
    </div>
  `,
})
export class InstitutionTableComponent {
  institutions = input.required<Institution[]>();

  edit = output<{ index: number; institution: Institution }>();
  del = output<number>();
  page = 1;
  pageSize = 5;

  get totalPages() {
    return Math.max(1, Math.ceil(this.institutions.length / this.pageSize));
  }

  pagedInstitutions() {
    const start = (this.page - 1) * this.pageSize;
    return this.institutions().slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }
  prevPage() {
    if (this.page > 1) this.page--;
  }
}
