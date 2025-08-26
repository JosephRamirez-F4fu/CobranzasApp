import { Component, signal } from '@angular/core';
import { InstitutionFormComponent } from './components/institution-form.component';
import { InstitutionTableComponent } from './components/institution-table.component';

export interface Institution {
  codigo: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

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

  addInstitution(inst: Institution) {
    if (this.editingIndex() !== null) {
      // Editar
      const arr = [...this.institutions()];
      arr[this.editingIndex()!] = inst;
      this.institutions.set(arr);
      this.editingInstitution.set(null);
      this.editingIndex.set(null);
    } else {
      // Agregar
      this.institutions.set([...this.institutions(), inst]);
    }
  }

  deleteInstitution(index: number) {
    const arr = [...this.institutions()];
    arr.splice(index, 1);
    this.institutions.set(arr);
    // Si se está editando la misma, cancelar edición
    if (this.editingIndex() === index) {
      this.editingInstitution.set(null);
      this.editingIndex.set(null);
    }
  }

  editInstitution(index: number, updated: Institution) {
    this.editingInstitution.set(updated);
    this.editingIndex.set(index);
  }
}
