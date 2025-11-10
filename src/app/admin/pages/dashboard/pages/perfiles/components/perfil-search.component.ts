import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { PerfilFilters } from '@services/perfiles.service';

@Component({
  selector: 'perfil-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <form [formGroup]="form" class="grid gap-4 md:grid-cols-4" (ngSubmit)="onSubmit()">
        <label class="text-sm font-medium text-slate-300 md:col-span-3">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Buscar</span>
          <input
            type="text"
            formControlName="search"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            placeholder="Nombre del perfil"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Estado</span>
          <select
            formControlName="activo"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Todos</option>
            <option [value]="true">Activos</option>
            <option [value]="false">Inactivos</option>
          </select>
        </label>

        <div class="flex items-end gap-2 md:col-span-4 justify-end">
          <button
            type="button"
            class="rounded border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            (click)="onReset()"
          >
            Limpiar
          </button>
          <button
            type="submit"
            class="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 disabled:opacity-50"
            [disabled]="loading"
          >
            Buscar
          </button>
        </div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilSearchComponent {
  private readonly fb = inject(FormBuilder);

  @Input() loading = false;
  @Output() search = new EventEmitter<Partial<PerfilFilters>>();
  @Output() reset = new EventEmitter<void>();

  readonly form: FormGroup = this.fb.group({
    search: [''],
    activo: [''],
  });

  onSubmit() {
    const raw = this.form.value;
    const filters: Partial<PerfilFilters> = {};

    if (raw.search) {
      filters.search = raw.search;
    }

    if (raw.activo !== '') {
      filters.activo = raw.activo === true || raw.activo === 'true';
    }

    this.search.emit(filters);
  }

  onReset() {
    this.form.reset({
      search: '',
      activo: '',
    });
    this.reset.emit();
  }
}
