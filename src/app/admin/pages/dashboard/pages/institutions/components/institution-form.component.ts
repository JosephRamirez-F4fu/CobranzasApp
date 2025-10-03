import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InstitutionForCreate } from '@services/institutions.service';

@Component({
  selector: 'institution-form',
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
          {{ editMode ? 'Actualizar institución' : 'Registrar nueva institución' }}
        </h2>
        <p class="text-sm text-slate-300">
          Completa la información principal de la institución para habilitar la gestión de sus usuarios y cronogramas.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Nombre</span>
          <input
            formControlName="name"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Ej. Colegio Nacional"
          />
        </label>

        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Código</span>
          <input
            formControlName="code"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Código interno"
          />
        </label>

        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Correo electrónico</span>
          <input
            formControlName="email"
            type="email"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="contacto@institucion.com"
          />
        </label>

        <label class="grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Teléfono</span>
          <input
            formControlName="phoneNumber"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Ej. +51 999 999 999"
          />
        </label>

        <label class="md:col-span-2 grid gap-2 text-slate-200">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/80">Dirección</span>
          <input
            formControlName="address"
            class="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 shadow-inner shadow-slate-950/50 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            placeholder="Dirección fiscal"
          />
        </label>
      </div>

      <footer class="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ editMode ? 'Actualizar' : 'Registrar' }}
        </button>
        <button
          *ngIf="editMode"
          type="button"
          (click)="onCancel()"
          class="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/60 px-6 py-2.5 text-sm font-semibold text-slate-200 shadow-inner shadow-slate-950/40 transition hover:border-rose-400 hover:bg-rose-500/10 hover:text-white"
        >
          Cancelar
        </button>
      </footer>
    </form>
  `,
})
export class InstitutionFormComponent implements OnChanges {
  @Input() institution: InstitutionForCreate | null = null;
  @Output() add = new EventEmitter<InstitutionForCreate>();
  @Output() cancel = new EventEmitter<void>();

  // usar FormBuilder correctamente en vez de new FormBuilder()
  fb = new FormBuilder();
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    code: ['', Validators.required],
  });
  editMode = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['institution'] && this.institution) {
      // normalizar types: convertir id a number si viene como string en algunos casos
      this.form.patchValue({
        name: this.institution.name,
        code: this.institution.code,
        email: this.institution.email,
        phoneNumber: this.institution.phoneNumber,
        address: this.institution.address,
      });
      this.editMode = true;
    } else if (changes['institution'] && !this.institution) {
      this.form.reset();
      this.editMode = false;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      this.add.emit({
        id: this.institution?.id ?? null,
        name: value.name ?? '',
        email: value.email ?? '',
        phoneNumber: value.phoneNumber ?? '',
        address: value.address ?? '',
        code: value.code ?? '',
      });
      this.form.reset();
      this.editMode = false;
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.form.reset();
    this.editMode = false;
    this.cancel.emit();
  }
}
