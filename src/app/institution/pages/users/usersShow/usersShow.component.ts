import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { InstitutionUsersService } from '../../../services/institution-users.service';
import { InstitutionUser } from '../../../services/institution-users.service';
import { InstitutionUserFormComponent } from '../../../components/user-form/user-form.component';
import { InstitutionUserTableComponent } from '../../../components/user-table/user-table.component';

interface InstitutionUserFormValue {
  id: number | null;
  nombreCompleto: string;
  correo: string;
  nombreUsuario: string;
  contrasena: string;
}

type InstitutionUserFormGroup = FormGroup<{
  id: FormControl<number | null>;
  nombreCompleto: FormControl<string>;
  correo: FormControl<string>;
  nombreUsuario: FormControl<string>;
  contrasena: FormControl<string>;
}>;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InstitutionUserFormComponent,
    InstitutionUserTableComponent,
  ],
  templateUrl: './usersShow.component.html',
  host: {
    class: 'block min-h-full bg-slate-100 p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersShowComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(InstitutionUsersService);

  readonly users = signal<InstitutionUser[]>([]);
  readonly totalPages = signal(0);
  readonly totalItems = signal(0);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly page = signal(0);
  readonly feedback = signal<string | null>(null);

  readonly form: InstitutionUserFormGroup = this.fb.group({
    id: this.fb.control<number | null>(null),
    nombreCompleto: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    correo: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email],
    }),
    nombreUsuario: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    contrasena: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  readonly editing = signal(false);

  private readonly pageSize = 10;

  constructor() {
    this.load();
  }

  load(page = this.page()) {
    this.loading.set(true);
    this.usersService
      .list(page, this.pageSize)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.users.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
          this.totalItems.set(response.data.totalItems);
          this.page.set(page);
        },
        error: (error) => this.handleError(error),
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as InstitutionUserFormValue;
    const payload = {
      nombreCompleto: value.nombreCompleto,
      correo: value.correo,
      nombreUsuario: value.nombreUsuario,
      contrasena: value.contrasena || undefined,
    };

    this.saving.set(true);
    const request$ = value.id
      ? this.usersService.update(value.id, payload)
      : this.usersService.create(payload);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(response.message || 'Operación completada correctamente.');
          this.resetForm();
          this.configurePasswordValidators(false);
          this.load(value.id ? this.page() : 0);
        },
        error: (error) => this.handleError(error),
      });
  }

  onEdit(user: InstitutionUser) {
    this.loading.set(true);
    this.usersService
      .findById(user.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.form.reset({
            id: data.id,
            nombreCompleto: data.nombreCompleto,
            correo: data.correo,
            nombreUsuario: data.nombreUsuario,
            contrasena: '',
          });
          this.configurePasswordValidators(true);
          this.editing.set(true);
        },
        error: (error) => this.handleError(error),
      });
  }

  onDeactivate(user: InstitutionUser) {
    if (!confirm(`¿Desea desactivar al usuario ${user.nombreUsuario}?`)) {
      return;
    }

    this.saving.set(true);
    this.usersService
      .deactivate(user.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(response.message || 'Usuario desactivado correctamente.');
          this.load(this.page());
        },
        error: (error) => this.handleError(error),
      });
  }

  onDelete(user: InstitutionUser) {
    if (!confirm(`Esta acción eliminará permanentemente a ${user.nombreUsuario}. ¿Desea continuar?`)) {
      return;
    }

    this.saving.set(true);
    this.usersService
      .remove(user.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.feedback.set(response.message || 'Usuario eliminado.');
          const currentPage = this.page();
          this.load(currentPage);
        },
        error: (error) => this.handleError(error),
      });
  }

  onCancelEdit() {
    this.resetForm();
    this.configurePasswordValidators(false);
  }

  onClearForm() {
    this.resetForm();
    this.configurePasswordValidators(false);
  }

  onPageChange(page: number) {
    this.load(page);
  }

  private resetForm() {
    this.form.reset({
      id: null,
      nombreCompleto: '',
      correo: '',
      nombreUsuario: '',
      contrasena: '',
    });
    this.editing.set(false);
  }

  private configurePasswordValidators(isEditing: boolean) {
    const control = this.form.controls.contrasena;
    control.clearValidators();
    if (!isEditing) {
      control.setValidators([Validators.required, Validators.minLength(6)]);
    }
    control.updateValueAndValidity();
  }

  private handleError(error: unknown) {
    let message = 'Ocurrió un error inesperado. Inténtelo nuevamente.';
    if (error instanceof HttpErrorResponse) {
      message =
        (error.error && (error.error.message || error.error.error)) ||
        error.message ||
        message;
    }
    this.feedback.set(message);
  }
}
