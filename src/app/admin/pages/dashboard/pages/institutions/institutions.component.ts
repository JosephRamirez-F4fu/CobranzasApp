import { Component, inject, signal } from '@angular/core';
import { InstitutionFormComponent } from './components/institution-form.component';
import { InstitutionTableComponent } from './components/institution-table.component';
import {
  Institution,
  InstitutionMapper,
  InstitutionsService,
} from '@services/institutions.service';

@Component({
  selector: 'institutions',
  standalone: true,
  imports: [InstitutionFormComponent, InstitutionTableComponent],
  templateUrl: './institutions.component.html',
})
export default class InstitutionsComponent {
  institutions = signal<Institution[]>([]);
  editingInstitution = signal<Institution | null>(null);
  editingIndex = signal<number | null>(null);
  service = inject(InstitutionsService);
  page = signal(1);
  pageSize = 5;
  totalPages = signal(1);
  loading = signal(false);

  addInstitution(inst: Institution) {
    if (this.editingIndex() !== null) {
      // Editar
      this.service.update(inst).subscribe({
        next: (response) => {
          const arr = [...this.institutions()];
          arr[this.editingIndex()!] = InstitutionMapper.fromDto(response.data);
          this.institutions.set(arr);
          this.editingInstitution.set(null);
          this.editingIndex.set(null);
        },
        error: () => {
          // Manejo de error (opcional)
        },
      });
    } else {
      this.service.save(inst).subscribe({
        next: (response) => {
          this.institutions.set([
            ...this.institutions(),
            InstitutionMapper.fromDto(response.data),
          ]);
        },
        error: () => {
          // Manejo de error (opcional)
        },
      });
    }
  }
  deleteInstitution(index: number) {
    const institution = this.institutions()[index];
    this.service.delete(institution.id!).subscribe({
      next: () => {
        const arr = [...this.institutions()];
        arr.splice(index, 1);
        this.institutions.set(arr);

        if (this.editingIndex() === index) {
          this.editingInstitution.set(null);
          this.editingIndex.set(null);
        }
      },
      error: () => {
        // Manejo de error (opcional)
      },
    });
  }

  editInstitution(index: number, updated: Institution) {
    this.editingInstitution.set({ ...updated });
    this.editingIndex.set(index);
  }

  loadInstitutions(page: number = 1) {
    this.loading.set(true);
    this.service.getPage(page, this.pageSize).subscribe({
      next: (response) => {
        // Suponiendo que response.data.items es el array y response.data.totalPages es el total
        this.institutions.set(
          response.data.items.map((dto: any) => InstitutionMapper.fromDto(dto))
        );
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
