import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { UserFormComponent } from './components/user-form.component';
import { UserTableComponent } from './components/user-table.component';
import { User } from '@services/user.service';
import { UsersClientsPageService } from './users-clients-page.service';

@Component({
  selector: 'users-clients',
  standalone: true,
  imports: [UserFormComponent, UserTableComponent],
  templateUrl: './users-clients.component.html',
  providers: [UsersClientsPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export default class UsersClientsComponent implements OnInit {
  protected readonly pageService = inject(UsersClientsPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onUserSaved(user: User) {
    this.pageService.saveUser(user);
  }

  onEditRequest(event: { id: number; user: User }) {
    this.pageService.startEdit(event.id, event.user);
  }

  onDeleteRequest(id: number) {
    this.pageService.deleteUser(id);
  }

  onPageChange(page: number) {
    this.pageService.loadUsers(page);
  }
}
