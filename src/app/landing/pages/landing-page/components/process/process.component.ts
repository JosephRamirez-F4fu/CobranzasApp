import { Component, input } from '@angular/core';
import { ProcessStep } from '../../landing-page.service';

@Component({
  selector: 'process',
  standalone: true,
  templateUrl: './process.component.html',
})
export class ProcessComponent {
  steps = input.required<ProcessStep[]>();
}
