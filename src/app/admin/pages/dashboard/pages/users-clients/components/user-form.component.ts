import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '@services/user.service';
import { Institution } from '@domain/interface/institution';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="grid gap-6 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
    >
      <header class="space-y-2 text-slate-100">
        <h2 class="text-2xl font-semibold text-white">
          {{ editMode ? 'Actualizar usuario' : 'Crear nuevo usuario' }}
        </h2>
        <p class="text-sm text-slate-300">
          Define los accesos y la institución asociada para gestionar roles administradores y maestros.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Nombre completo</span>
          <input
            formControlName="nombreCompleto"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Ej. Ana Torres"
          />
        </label>

        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Nombre de usuario</span>
          <input
            formControlName="nombreUsuario"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="atorres"
          />
        </label>

        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Correo electrónico</span>
          <input
            formControlName="correo"
            type="email"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="usuario@institucion.com"
          />
        </label>

        <ng-container *ngIf="!editMode; else passwordInfo">
          <label class="grid gap-2 text-slate-200">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Contraseña</span>
            <input
              formControlName="contrasena"
              type="password"
              class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              placeholder="Contraseña temporal"
            />
          </label>
        </ng-container>

        <label class="md:col-span-2 grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Institución</span>
          <select
            formControlName="institutionId"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="" class="bg-slate-900 text-slate-200">Sin institución (rol MASTER)</option>
            @for (inst of institutions(); track inst.id) {
              <option [value]="inst.id" class="bg-slate-900 text-slate-200">
                {{ inst.code }} - {{ inst.name }}
              </option>
            }
          </select>
        </label>
      </div>

      <ng-template #passwordInfo>
        <div class="rounded-2xl border border-slate-600/80 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-300">
          La contraseña existente se mantiene por seguridad.
        </div>
      </ng-template>

      <footer class="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ editMode ? 'Actualizar' : 'Registrar' }}
        </button>
      </footer>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class UserFormComponent implements OnChanges {
  user = input<User | null>(null);
  add = output<User>();
  form = new FormBuilder().group({
    nombreCompleto: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    institutionId: [''],
  });
  editMode = false;
  institutions = input.required<Institution[]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user()) {
      this.form.patchValue({
        ...this.user(),
        institutionId:
          this.user()?.institutionId !== null
            ? String(this.user()?.institutionId)
            : '',
      });
      this.editMode = true;
      this.form.get('contrasena')?.clearValidators();
      this.form.get('contrasena')?.updateValueAndValidity();
    } else if (changes['user'] && !this.user) {
      this.form.reset();
      this.editMode = false;
      this.form.get('contrasena')?.setValidators(Validators.required);
      this.form.get('contrasena')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      this.add.emit({
        id: this.user()?.id ?? null,
        nombreCompleto: value.nombreCompleto ?? '',
        nombreUsuario: value.nombreUsuario ?? '',
        correo: value.correo ?? '',
        contrasena: value.contrasena ?? '',
        institutionId: value.institutionId ? Number(value.institutionId) : null,
        rol: value.institutionId ? 'ADMIN' : 'MASTER',
      });
      this.form.reset();
      this.editMode = false;
      this.form.get('contrasena')?.setValidators(Validators.required);
      this.form.get('contrasena')?.updateValueAndValidity();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
