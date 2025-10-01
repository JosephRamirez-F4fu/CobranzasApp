import { Component, input } from '@angular/core';
import { DetailsSection } from '../../landing-page.service';

@Component({
  selector: 'details-section',
  standalone: true,
  templateUrl: './details-section.component.html',
})
export class DetailsSectionComponent {
  details = input.required<DetailsSection>();
}
