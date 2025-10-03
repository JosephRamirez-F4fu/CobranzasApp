import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InstitutionLogin } from '@services/institutions.service';

@Component({
  selector: 'app-institution-info',
  imports: [],
  templateUrl: './InstitutionInfo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class InstitutionInfoComponent {
  institution = input<InstitutionLogin | null>(null);
}
