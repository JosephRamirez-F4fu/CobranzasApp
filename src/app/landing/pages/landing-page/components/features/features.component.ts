import { Component, input } from '@angular/core';
import { FeatureCard } from '../../landing-page.service';

@Component({
  selector: 'features',
  standalone: true,
  templateUrl: './features.component.html',
})
export class FeaturesComponent {
  features = input.required<FeatureCard[]>();
}
