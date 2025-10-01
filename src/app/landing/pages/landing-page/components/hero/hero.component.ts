import { Component, input } from '@angular/core';

@Component({
  selector: 'hero',
  standalone: true,
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  heading = input.required<string>();
  description = input.required<string>();
  ctaLabel = input.required<string>();
  ctaHref = input.required<string>();
  backgroundImage = input.required<string>();
}
