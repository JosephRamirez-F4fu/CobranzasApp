import { inject, Injectable, signal } from '@angular/core';
import {
  Variable,
  VariableFilters,
  VariablePayload,
  VariableService,
} from '@services/variable.service';

@Injectable()
export class VariablesPageService {
  private readonly variableService = inject(VariableService);

  readonly variables = signal<Variable[]>([]);
  readonly loading = signal(false);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly editingVariable = signal<Variable | null>(null);
  readonly filters = signal<VariableFilters>({
    page: 0,
    size: 10,
  });

  private readonly pageSize = 10;

  initialize() {
    this.loadPage(1);
  }

  applyFilters(partial: Partial<VariableFilters>) {
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
    const activeFilters: VariableFilters = {
      ...this.filters(),
      page: nextPage - 1,
      size: this.pageSize,
    };

    this.loading.set(true);

    this.variableService.getPage(activeFilters).subscribe({
      next: (response) => {
        this.variables.set(response.data.items);
        this.totalPages.set(response.data.pagination.totalPages);
        this.page.set(nextPage);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  startEdit(variable: Variable) {
    this.editingVariable.set({ ...variable });
  }

  cancelEdit() {
    this.editingVariable.set(null);
  }

  saveVariable(payload: VariablePayload) {
    const editing = this.editingVariable();

    if (editing?.id) {
      this.updateVariable(editing.id, payload);
      return;
    }

    this.variableService.create(payload).subscribe({
      next: () => {
        this.loadPage(1);
        this.cancelEdit();
      },
    });
  }

  deleteVariable(id: number) {
    this.variableService.delete(id).subscribe({
      next: () => {
        this.variables.update((items) =>
          items.filter((variable) => variable.id !== id)
        );
        this.cancelEdit();
      },
    });
  }

  private updateVariable(id: number, payload: VariablePayload) {
    this.variableService.update(id, payload).subscribe({
      next: () => {
        this.loadPage(this.page());
        this.cancelEdit();
      },
    });
  }
}
