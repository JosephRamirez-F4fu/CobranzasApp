import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringSearchComponent } from './components/scoring-search.component';
import { ScoringTableComponent } from './components/scoring-table.component';
import { ScoringConfigFormComponent } from './components/scoring-config-form.component';
import {
  ScoringConfigurationPayload,
  ScoringLogFilters,
} from '@services/scoring.service';
import { ScoringPageService } from './scoring-page.service';

@Component({
  selector: 'admin-scoring',
  standalone: true,
  imports: [CommonModule, ScoringSearchComponent, ScoringTableComponent, ScoringConfigFormComponent],
  templateUrl: './scoring.component.html',
  providers: [ScoringPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export default class ScoringComponent implements OnInit {
  protected readonly pageService = inject(ScoringPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onSearch(filters: Partial<ScoringLogFilters>) {
    this.pageService.applyFilters(filters);
  }

  onSearchReset() {
    this.pageService.resetFilters();
  }

  onPageChange(page: number) {
    this.pageService.loadLogs(page);
  }

  onConfigurationSaved(payload: ScoringConfigurationPayload) {
    this.pageService.saveConfiguration(payload);
  }

  onExport() {
    this.pageService.exportLogs();
  }
}
