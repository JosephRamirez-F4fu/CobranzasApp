import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InstitutionFormComponent } from './components/institution-form.component';
import { InstitutionTableComponent } from './components/institution-table.component';
import { InstitutionForCreate } from '@services/institutions.service';
import { InstitutionsPageService } from './institutions-page.service';

@Component({
  selector: 'institutions',
  standalone: true,
  imports: [InstitutionFormComponent, InstitutionTableComponent],
  templateUrl: './institutions.component.html',
  providers: [InstitutionsPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export default class InstitutionsComponent implements OnInit {
  protected readonly pageService = inject(InstitutionsPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onInstitutionSaved(institution: InstitutionForCreate) {
    this.pageService.saveInstitution(institution);
  }

  onEditRequest(event: { id: number; institution: InstitutionForCreate }) {
    this.pageService.startEdit(event.institution);
  }

  onDeleteRequest(id: number) {
    this.pageService.deleteInstitution(id);
  }

  onPageChange(page: number) {
    this.pageService.loadPage(page);
  }

  onCancelEdit() {
    this.pageService.cancelEdit();
  }
}
