import { Component, input } from '@angular/core';
import { Testimonial } from '../../landing-page.service';

@Component({
  selector: 'testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  testimonials = input.required<Testimonial[]>();
}
