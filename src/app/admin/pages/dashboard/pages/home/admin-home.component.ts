import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminHomeSummaryComponent } from './components/admin-home-summary/admin-home-summary.component';
import { AdminHomeService } from './admin-home.service';

@Component({
  selector: 'app-admin-home',
  imports: [AdminHomeSummaryComponent],
  templateUrl: './admin-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminHomeService],
})
export default class AdminHomeComponent {
  protected readonly homeService = inject(AdminHomeService);
}
