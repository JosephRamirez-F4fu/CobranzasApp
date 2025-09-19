import { Component, input, output } from '@angular/core';
import { User } from '@services/user.service';
import { Institution } from '@domain/interface/institution';

@Component({
  selector: 'user-table',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-white rounded-xl shadow p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2">Nombre</th>
            <th class="py-2">Email</th>
            <th class="py-2">Rol</th>
            <th class="py-2">Institución</th>
            <th class="py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (user of users(); track user) {
          <tr class="border-b hover:bg-blue-50">
            <td class="py-2">{{ user.nombreCompleto }}</td>
            <td class="py-2">{{ user.correo }}</td>
            <td class="py-2">{{ user.rol }}</td>
            <td class="py-2">{{ institutionName(user.institutionId) }}</td>
            <td class="py-2 flex gap-2 justify-center">
              <button
                (click)="edit.emit({ id: user.id!, user })"
                class="px-2 py-1 bg-yellow-400 text-xs rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                (click)="del.emit(user.id!)"
                class="px-2 py-1 bg-red-500 text-xs text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
          } @empty{
          <tr>
            <td colspan="5" class="py-2 text-center">
              No hay usuarios registrados
            </td>
          </tr>
          }
        </tbody>
      </table>
      <div class="flex justify-end gap-2 mt-4">
        <button
          (click)="prevPage()"
          [disabled]="page() === 1"
          class="px-3 py-1 rounded bg-gray-200"
        >
          Anterior
        </button>
        <span>Página {{ page() }} de {{ totalPages() }}</span>
        <button
          (click)="nextPage()"
          [disabled]="page() === totalPages()"
          class="px-3 py-1 rounded bg-gray-200"
        >
          Siguiente
        </button>
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
