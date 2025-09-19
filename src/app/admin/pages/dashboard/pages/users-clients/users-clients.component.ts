import { Component, inject, signal } from '@angular/core';
import { UserFormComponent } from './components/user-form.component';
import { UserTableComponent } from './components/user-table.component';

import { InstitutionsService } from '@services/institutions.service';
import { User, UserMapper, UserService } from '@services/user.service';
import { Institution } from '@domain/interface/institution';

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
  userService = inject(UserService);
  institutionService = inject(InstitutionsService);
  page = signal(1);
  pageSize = 5;
  totalPages = signal(1);
  loading = signal(false);
  institutions = signal<Institution[]>([]);

  ngOnInit() {
    this.institutionService.getPage(0, 100).subscribe({
      next: (response) => {
        this.institutions.set(response.data.items);
      },
    });
  }

  addUser(user: User) {
    if (this.editingIndex() !== null) {
      this.userService.update(user).subscribe({
        next: (response) => {
          const arr = [...this.users()];
          arr[this.editingIndex()!] = UserMapper.fromDto(response.data);
          this.users.set(arr);
          this.editingUser.set(null);
          this.editingIndex.set(null);
        },
      });
    } else {
      this.userService.save(user).subscribe({
        next: (response) => {
          this.users.set([...this.users(), UserMapper.fromDto(response.data)]);
        },
      });
    }
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => {
        const arr = [...this.users()];
        arr.splice(
          this.users().findIndex((u) => u.id === id),
          1
        );
        this.users.set(arr);
      },
    });
  }

  editUser(index: number, user: User) {
    this.editingUser.set({ ...user });
    this.editingIndex.set(index);
  }

  loadUsers(page: number = 1) {
    this.loading.set(true);
    this.userService.getPage(page, this.pageSize).subscribe({
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
