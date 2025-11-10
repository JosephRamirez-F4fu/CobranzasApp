import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilFormComponent } from './components/perfil-form.component';
import { PerfilSearchComponent } from './components/perfil-search.component';
import { PerfilTableComponent } from './components/perfil-table.component';
import {
  Perfil,
  PerfilFilters,
  PerfilPayload,
} from '@services/perfiles.service';
import { PerfilesPageService } from './perfiles-page.service';

@Component({
  selector: 'admin-perfiles',
  standalone: true,
  imports: [
    CommonModule,
    PerfilFormComponent,
    PerfilSearchComponent,
    PerfilTableComponent,
  ],
  templateUrl: './perfiles.component.html',
  providers: [PerfilesPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export default class PerfilesComponent implements OnInit {
  protected readonly pageService = inject(PerfilesPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onSearch(filters: Partial<PerfilFilters>) {
    this.pageService.applyFilters(filters);
  }

  onSearchReset() {
    this.pageService.resetFilters();
  }

  onPerfilSaved(payload: PerfilPayload) {
    this.pageService.savePerfil(payload);
  }

  onEditRequest(perfil: Perfil) {
    this.pageService.startEdit(perfil);
  }

  onDeleteRequest(id: number) {
    this.pageService.deletePerfil(id);
  }

  onToggleStatus(perfil: Perfil) {
    this.pageService.toggleStatus(perfil);
  }

  onPageChange(page: number) {
    this.pageService.loadPage(page);
  }

  onCancelEdit() {
    this.pageService.cancelEdit();
  }
}
