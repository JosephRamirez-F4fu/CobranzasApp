import { Component, inject } from '@angular/core';
import { AuthNotFoundMessageComponent } from './components/not-found-message/not-found-message.component';
import { AuthNotFoundPageService } from './not-found-page.service';

@Component({
  selector: 'not-found-page',
  imports: [AuthNotFoundMessageComponent],
  templateUrl: './not-found.html',
  providers: [AuthNotFoundPageService],
})
export class NotFoundComponent {
  protected readonly pageService = inject(AuthNotFoundPageService);
}
