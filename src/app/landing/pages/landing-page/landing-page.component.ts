import { Component, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';
import { ProcessComponent } from './components/process/process.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FeaturesComponent,
    DetailsSectionComponent,
    ContactFormComponent,
    ProcessComponent,
    TestimonialsComponent,
    HeroComponent,
  ],
  templateUrl: './landing-page.component.html',
  providers: [LandingPageService],
})
export class LandingPageComponent {
  protected readonly landingPageService = inject(LandingPageService);
}
