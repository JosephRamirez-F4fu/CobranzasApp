import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariableFormComponent } from './components/variable-form.component';
import { VariableSearchComponent } from './components/variable-search.component';
import { VariableTableComponent } from './components/variable-table.component';
import {
  Variable,
  VariableFilters,
  VariablePayload,
} from '@services/variable.service';
import { VariablesPageService } from './variables-page.service';

@Component({
  selector: 'admin-variables',
  standalone: true,
  imports: [
    CommonModule,
    VariableFormComponent,
    VariableSearchComponent,
    VariableTableComponent,
  ],
  templateUrl: './variables.component.html',
  providers: [VariablesPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export default class VariablesComponent implements OnInit {
  protected readonly pageService = inject(VariablesPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onSearch(filters: Partial<VariableFilters>) {
    this.pageService.applyFilters(filters);
  }

  onSearchReset() {
    this.pageService.resetFilters();
  }

  onVariableSaved(payload: VariablePayload) {
    this.pageService.saveVariable(payload);
  }

  onEditRequest(variable: Variable) {
    this.pageService.startEdit(variable);
  }

  onDeleteRequest(id: number) {
    this.pageService.deleteVariable(id);
  }

  onPageChange(page: number) {
    this.pageService.loadPage(page);
  }

  onCancelEdit() {
    this.pageService.cancelEdit();
  }
}
