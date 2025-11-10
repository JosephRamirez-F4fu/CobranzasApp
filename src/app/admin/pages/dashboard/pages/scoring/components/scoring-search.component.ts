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
import { ScoringLogFilters } from '@services/scoring.service';

@Component({
  selector: 'scoring-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <form [formGroup]="form" class="grid gap-4 md:grid-cols-5" (ngSubmit)="onSubmit()">
        <label class="text-sm font-medium text-slate-300 md:col-span-2">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Perfil</span>
          <input
            type="text"
            formControlName="perfil"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            placeholder="Nombre del perfil"
          />
        </label>

        <label class="text-sm font-medium text-slate-300 md:col-span-2">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Cuenta</span>
          <input
            type="text"
            formControlName="cuenta"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            placeholder="Código de cuenta"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Fecha inicio</span>
          <input
            type="date"
            formControlName="fechaInicio"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Fecha fin</span>
          <input
            type="date"
            formControlName="fechaFin"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <div class="flex items-end gap-2 md:col-span-5 justify-end">
          <button
            type="button"
            class="rounded border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            (click)="onReset()"
          >
            Limpiar
          </button>
          <button
            type="submit"
            class="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
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
export class ScoringSearchComponent {
  private readonly fb = inject(FormBuilder);

  @Input() loading = false;
  @Output() search = new EventEmitter<Partial<ScoringLogFilters>>();
  @Output() reset = new EventEmitter<void>();

  readonly form: FormGroup = this.fb.group({
    perfil: [''],
    cuenta: [''],
    fechaInicio: [''],
    fechaFin: [''],
  });

  onSubmit() {
    const filters: Partial<ScoringLogFilters> = {};
    const raw = this.form.value;

    if (raw.perfil?.trim()) {
      filters.perfil = raw.perfil.trim();
    }

    if (raw.cuenta?.trim()) {
      filters.cuenta = raw.cuenta.trim();
    }

    if (raw.fechaInicio) {
      filters.fechaInicio = raw.fechaInicio;
    }

    if (raw.fechaFin) {
      filters.fechaFin = raw.fechaFin;
    }

    this.search.emit(filters);
  }

  onReset() {
    this.form.reset({
      perfil: '',
      cuenta: '',
      fechaInicio: '',
      fechaFin: '',
    });
    this.reset.emit();
  }
}
