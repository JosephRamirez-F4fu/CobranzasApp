import { inject, Injectable, signal } from '@angular/core';
import { Institution } from '@domain/interface/institution';
import {
  InstitutionForCreate,
  InstitutionsService,
} from '@services/institutions.service';

@Injectable()
export class InstitutionsPageService {
  private readonly institutionsService = inject(InstitutionsService);

  readonly institutions = signal<Institution[]>([]);
  readonly editingInstitution = signal<InstitutionForCreate | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly loading = signal(false);

  private readonly pageSize = 5;

  initialize() {
    this.loadPage(1);
  }

  loadPage(nextPage: number) {
    this.loading.set(true);
    this.institutionsService
      .getPage(nextPage - 1, this.pageSize)
      .subscribe({
        next: (response) => {
          this.institutions.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
          this.page.set(nextPage);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  startEdit(institution: InstitutionForCreate) {
    this.editingInstitution.set({ ...institution });
  }

  cancelEdit() {
    this.editingInstitution.set(null);
  }

  saveInstitution(institution: InstitutionForCreate) {
    if (institution.id) {
      this.updateInstitution(institution);
      return;
    }

    this.institutionsService.save(institution).subscribe({
      next: (response) => {
        this.institutions.set([...this.institutions(), response.data]);
        this.totalPages.update((value) => value);
      },
    });
  }

  deleteInstitution(id: number) {
    this.institutionsService.delete(id).subscribe({
      next: () => {
        this.institutions.update((items) => items.filter((inst) => inst.id !== id));
        this.cancelEdit();
      },
    });
  }

  private updateInstitution(institution: InstitutionForCreate) {
    this.institutionsService.update(institution).subscribe({
      next: (response) => {
        this.institutions.update((items) =>
          items.map((item) => (item.id === response.data.id ? response.data : item))
        );
        this.cancelEdit();
      },
    });
  }
}
