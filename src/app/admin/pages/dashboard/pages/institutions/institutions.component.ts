import { Component, inject, signal } from '@angular/core';
import { InstitutionFormComponent } from './components/institution-form.component';
import { InstitutionTableComponent } from './components/institution-table.component';
import {
  InstitutionForCreate,
  InstitutionMapper,
  InstitutionsService,
} from '@services/institutions.service';
import { Institution } from 'src/app/domain/interface/institution';

@Component({
  selector: 'institutions',
  standalone: true,
  imports: [InstitutionFormComponent, InstitutionTableComponent],
  templateUrl: './institutions.component.html',
})
export default class InstitutionsComponent {
  institutions = signal<Institution[]>([]);
  editingInstitution = signal<InstitutionForCreate | null>(null);
  editingIndex = signal<number | null>(null);
  service = inject(InstitutionsService);
  page = signal(1);
  pageSize = 5;
  totalPages = signal(1);
  loading = signal(false);

  addInstitution(inst: InstitutionForCreate) {
    // si viene con id, intentar actualizar (buscar índice por id)
    if (inst.id != null) {
      this.service.update(inst).subscribe({
        next: (response) => {
          // search in array and updaqte value
          this.institutions.update((list) =>
            list.map((i) => (i.id === inst.id ? response.data : i))
          );

          this.editingInstitution.set(null);
          this.editingIndex.set(null);
        },
        error: () => {
          // Manejo de error (opcional)
        },
      });
    } else {
      // nueva institución
      this.service.save(inst).subscribe({
        next: (response) => {
          this.institutions.set([...this.institutions(), response.data]);
        },
        error: () => {
          // Manejo de error (opcional)
        },
      });
    }
  }

  deleteInstitution(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.institutions.update((list) => list.filter((i) => i.id !== id));
        this.editingInstitution.set(null);
        this.editingIndex.set(null);
      },
      error: () => {
        // Manejo de error (opcional)
      },
    });
  }

  editInstitution(id: number, updated: InstitutionForCreate) {
    const arr = [...this.institutions()];
    const idx = arr.findIndex((i) => i.id === id);
    this.editingIndex.set(idx >= 0 ? idx : null);
    // pasar nueva referencia para forzar patch en el formulario
    this.editingInstitution.set({ ...updated });
  }

  loadInstitutions(page: number = 1) {
    this.loading.set(true);
    this.service.getPage(page, this.pageSize).subscribe({
      next: (response) => {
        // Suponiendo que response.data.items es el array y response.data.totalPages es el total
        this.institutions.set(response.data.items);
        this.totalPages.set(response.data.totalPages);
        this.page.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        // Manejo de error
      },
    });
  }

  constructor() {
    this.loadInstitutions(this.page() - 1);
  }
}
