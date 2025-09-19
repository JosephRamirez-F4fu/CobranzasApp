import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InstitutionLogin } from '@services/institutions.service';

@Component({
  selector: 'app-institution-info',
  imports: [],
  templateUrl: './InstitutionInfo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionInfoComponent {
  institution = input<InstitutionLogin | null>(null);
}
