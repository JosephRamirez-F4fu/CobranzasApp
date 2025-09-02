import { Component, inject, signal } from '@angular/core';
import { UserFormComponent } from './components/user-form.component';
import { UserTableComponent } from './components/user-table.component';

import { User, UserService, UserMapper } from '@services/user.service';

@Component({
  selector: 'users-clients',
  standalone: true,
  imports: [UserFormComponent, UserTableComponent],
  templateUrl: './users-clients.component.html',
})
export default class UsersClientsComponent {
  users = signal<User[]>([]);
  editingUser = signal<User | null>(null);
  editingIndex = signal<number | null>(null);
  service = inject(UserService);
  page = signal(1);
  pageSize = 5;
  totalPages = signal(1);
  loading = signal(false);

  addUser(user: User) {
    if (this.editingIndex() !== null) {
      this.service.update(user).subscribe({
        next: (response) => {
          const arr = [...this.users()];
          arr[this.editingIndex()!] = UserMapper.fromDto(response.data);
          this.users.set(arr);
          this.editingUser.set(null);
          this.editingIndex.set(null);
        },
      });
    } else {
      this.service.save(user).subscribe({
        next: (response) => {
          this.users.set([...this.users(), UserMapper.fromDto(response.data)]);
        },
      });
    }
  }

  deleteUser(index: number) {
    const user = this.users()[index];
    this.service.delete(user.id!).subscribe({
      next: () => {
        const arr = [...this.users()];
        arr.splice(index, 1);
        this.users.set(arr);
        if (this.editingIndex() === index) {
          this.editingUser.set(null);
          this.editingIndex.set(null);
        }
      },
    });
  }

  editUser(index: number, user: User) {
    this.editingUser.set({ ...user });
    this.editingIndex.set(index);
  }

  loadUsers(page: number = 1) {
    this.loading.set(true);
    this.service.getPage(page, this.pageSize).subscribe({
      next: (response) => {
        this.users.set(response.data.items.map(UserMapper.fromDto));
        this.totalPages.set(response.data.totalPages);
        this.page.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  constructor() {
    this.loadUsers(this.page() - 1);
  }
}
