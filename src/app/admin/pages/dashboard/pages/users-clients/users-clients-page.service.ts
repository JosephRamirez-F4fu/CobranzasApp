import { inject, Injectable, signal } from '@angular/core';
import { Institution } from '@domain/interface/institution';
import { InstitutionsService } from '@services/institutions.service';
import { User, UserMapper, UserService } from '@services/user.service';

@Injectable()
export class UsersClientsPageService {
  private readonly userService = inject(UserService);
  private readonly institutionsService = inject(InstitutionsService);

  readonly users = signal<User[]>([]);
  readonly editingUser = signal<User | null>(null);
  readonly editingIndex = signal<number | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly loading = signal(false);
  readonly institutions = signal<Institution[]>([]);

  private readonly pageSize = 5;

  initialize() {
    this.loadInstitutions();
    this.loadUsers(1);
  }

  loadUsers(nextPage: number) {
    this.loading.set(true);
    this.userService.getPage(nextPage - 1, this.pageSize).subscribe({
      next: (response) => {
        this.users.set(response.data.items.map(UserMapper.fromDto));
        this.totalPages.set(response.data.totalPages);
        this.page.set(nextPage);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  saveUser(user: User) {
    if (user.id && this.editingIndex() !== null) {
      this.updateUser(user);
      return;
    }

    this.userService.save(user).subscribe({
      next: (response) => {
        this.users.set([...this.users(), UserMapper.fromDto(response.data)]);
      },
    });
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => {
        this.users.update((items) => items.filter((user) => user.id !== id));
      },
    });
  }

  startEdit(index: number, user: User) {
    this.editingUser.set({ ...user });
    this.editingIndex.set(index);
  }

  clearEdit() {
    this.editingUser.set(null);
    this.editingIndex.set(null);
  }

  private updateUser(user: User) {
    this.userService.update(user).subscribe({
      next: (response) => {
        const updated = UserMapper.fromDto(response.data);
        this.users.update((items) =>
          items.map((item) => (item.id === updated.id ? updated : item))
        );
        this.clearEdit();
      },
    });
  }

  private loadInstitutions() {
    this.institutionsService.getPage(0, 100).subscribe({
      next: (response) => {
        this.institutions.set(response.data.items);
      },
    });
  }
}
