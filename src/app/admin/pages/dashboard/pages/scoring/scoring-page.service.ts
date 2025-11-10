import { inject, Injectable, signal } from '@angular/core';
import {
  PaginationMeta,
  ScoringConfiguration,
  ScoringConfigurationPayload,
  ScoringLog,
  ScoringLogFilters,
  ScoringService,
} from '@services/scoring.service';

@Injectable()
export class ScoringPageService {
  private readonly scoringService = inject(ScoringService);

  readonly logs = signal<ScoringLog[]>([]);
  readonly pagination = signal<PaginationMeta>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  });
  readonly loading = signal(false);
  readonly exporting = signal(false);
  readonly configuration = signal<ScoringConfiguration | null>(null);
  readonly filters = signal<ScoringLogFilters>({
    page: 0,
    size: 10,
  });

  private readonly pageSize = 10;

  initialize() {
    this.loadLogs(1);
    this.loadConfiguration();
  }

  applyFilters(partial: Partial<ScoringLogFilters>) {
    this.filters.update((current) => ({
      ...current,
      ...partial,
      page: 0,
      size: this.pageSize,
    }));
    this.loadLogs(1);
  }

  resetFilters() {
    this.filters.set({
      page: 0,
      size: this.pageSize,
    });
    this.loadLogs(1);
  }

  loadLogs(page: number) {
    const activeFilters: ScoringLogFilters = {
      ...this.filters(),
      page: page - 1,
      size: this.pageSize,
    };

    this.loading.set(true);
    this.scoringService.getLogs(activeFilters).subscribe({
      next: (response) => {
        this.logs.set(response.data.items);
        const pagination = response.data.pagination;
        this.pagination.set({
          currentPage: page,
          totalItems: pagination?.totalItems ?? 0,
          totalPages: pagination?.totalPages ?? 0,
        });
        this.filters.set(activeFilters);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  saveConfiguration(payload: ScoringConfigurationPayload) {
    this.scoringService.updateConfiguration(payload).subscribe({
      next: (response) => {
        this.configuration.set(response.data);
      },
    });
  }

  exportLogs() {
    this.exporting.set(true);
    this.scoringService.exportLogs(this.filters()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scoring-logs-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => {
        this.exporting.set(false);
      },
    });
  }

  private loadConfiguration() {
    this.scoringService.getConfiguration().subscribe({
      next: (response) => this.configuration.set(response.data),
    });
  }
}
