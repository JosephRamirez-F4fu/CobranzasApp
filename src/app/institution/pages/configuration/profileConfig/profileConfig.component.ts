import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '@services/account.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ConfigSectionComponent } from '../../../components/config-section/config-section.component';
import { ConfigFormActionsComponent } from '../../../components/config-form-actions/config-form-actions.component';

@Component({
  selector: 'app-profile-config',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigSectionComponent,
    ConfigFormActionsComponent,
  ],
  templateUrl: './profileConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileConfigComponent {
  fb = inject(FormBuilder);
  account = inject(AccountService);

  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  editing = signal<boolean>(false);

  form = this.fb.group({
    nombreCompleto: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    correo: this.fb.control<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    nombreUsuario: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });

  formChangPassword = this.fb.group({
    oldPassword: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    newPassword: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmNewPassword: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });

  get passwordMismatch() {
    return (
      this.formChangPassword.controls.newPassword.value !==
      this.formChangPassword.controls.confirmNewPassword.value
    );
  }

  constructor() {
    this.load();
    this.form.disable();
  }

  load() {
    this.loading.set(true);
    this.account
      .load()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((res) => {
        this.account.user.set(res.data);
        this.form.patchValue({
          nombreCompleto: res.data.nombreCompleto,
          correo: res.data.correo,
          nombreUsuario: res.data.nombreUsuario,
        });
      });
  }

  enableEdit() {
    this.editing.set(true);
    this.form.enable();
  }

  cancel() {
    const u = this.account.user();
    if (u) {
      this.form.reset({
        nombreCompleto: u.nombreCompleto,
        correo: u.correo,
        nombreUsuario: u.nombreUsuario,
      });
    }
    this.editing.set(false);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.account
      .updateProfile({
        nombreCompleto: this.form.value.nombreCompleto!,
        correo: this.form.value.correo!,
        rol: this.account.user()!.rol, // mantener el rol actual --- IGNORE ---
        nombreUsuario: this.form.value.nombreUsuario!,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((res) => {
        this.account.user.set(res.data);
        this.editing.set(false);
      });
  }

  changingPassword = signal<boolean>(false);

  changePassword() {
    if (this.formChangPassword.invalid || this.passwordMismatch) {
      this.formChangPassword.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.account
      .change_password({
        oldPassword: this.formChangPassword.value.oldPassword!,
        newPassword: this.formChangPassword.value.newPassword!,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((res) => {
        this.formChangPassword.reset();
      });
  }
}
