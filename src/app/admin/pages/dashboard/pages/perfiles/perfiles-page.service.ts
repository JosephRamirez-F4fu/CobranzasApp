import { inject, Injectable, signal } from '@angular/core';
import {
  Perfil,
  PerfilFilters,
  PerfilPayload,
  PerfilesService,
} from '@services/perfiles.service';

@Injectable()
export class PerfilesPageService {
  private readonly perfilesService = inject(PerfilesService);

  readonly perfiles = signal<Perfil[]>([]);
  readonly loading = signal(false);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly editingPerfil = signal<Perfil | null>(null);
  readonly filters = signal<PerfilFilters>({
    page: 0,
    size: 10,
  });

  private readonly pageSize = 10;

  initialize() {
    this.loadPage(1);
  }

  applyFilters(partial: Partial<PerfilFilters>) {
    this.filters.update((current) => ({
      ...current,
      ...partial,
      page: 0,
      size: this.pageSize,
    }));
    this.loadPage(1);
  }

  resetFilters() {
    this.filters.set({
      page: 0,
      size: this.pageSize,
    });
    this.loadPage(1);
  }

  loadPage(nextPage: number) {
    const activeFilters: PerfilFilters = {
      ...this.filters(),
      page: nextPage - 1,
      size: this.pageSize,
    };

    this.loading.set(true);
    this.perfilesService.getPage(activeFilters).subscribe({
      next: (response) => {
        this.perfiles.set(response.data.items);
        this.totalPages.set(response.data.pagination.totalPages);
        this.page.set(nextPage);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  startEdit(perfil: Perfil) {
    this.editingPerfil.set({ ...perfil });
  }

  cancelEdit() {
    this.editingPerfil.set(null);
  }

  savePerfil(payload: PerfilPayload) {
    const editing = this.editingPerfil();

    if (editing?.id) {
      this.updatePerfil(editing.id, payload);
      return;
    }

    this.perfilesService.create(payload).subscribe({
      next: () => {
        this.loadPage(1);
        this.cancelEdit();
      },
    });
  }

  deletePerfil(id: number) {
    this.perfilesService.delete(id).subscribe({
      next: () => {
        this.perfiles.update((items) => items.filter((perfil) => perfil.id !== id));
        this.cancelEdit();
      },
    });
  }

  toggleStatus(perfil: Perfil) {
    if (!perfil.id) {
      return;
    }

    this.perfilesService
      .patch(perfil.id, { activo: !perfil.activo })
      .subscribe({
        next: () => {
          this.loadPage(this.page());
        },
      });
  }

  private updatePerfil(id: number, payload: PerfilPayload) {
    this.perfilesService.update(id, payload).subscribe({
      next: () => {
        this.loadPage(this.page());
        this.cancelEdit();
      },
    });
  }
}
