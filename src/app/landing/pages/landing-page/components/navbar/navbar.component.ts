import { Component, input } from '@angular/core';

@Component({
  selector: 'navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = input.required<string>();
}
