import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ScoringConfiguration,
  ScoringConfigurationPayload,
} from '@services/scoring.service';

@Component({
  selector: 'scoring-config-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <header class="mb-4">
        <p class="text-xs uppercase tracking-[0.3em] text-amber-400">Configuración</p>
        <h2 class="text-xl font-semibold text-white">Motor de scoring</h2>
      </header>

      <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()">
        <label class="block text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400"
            >Número de iteraciones</span
          >
          <input
            type="number"
            formControlName="numeroIteraciones"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            min="1"
          />
        </label>

        <label class="block text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400"
            >Responsable</span
          >
          <input
            type="text"
            formControlName="responsableNombre"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            placeholder="Nombre del responsable"
          />
        </label>

        <button
          type="submit"
          class="w-full rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
          [disabled]="form.invalid"
        >
          Guardar configuración
        </button>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoringConfigFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() configuration: ScoringConfiguration | null = null;
  @Output() save = new EventEmitter<ScoringConfigurationPayload>();

  readonly form: FormGroup = this.fb.group({
    numeroIteraciones: [1, [Validators.required, Validators.min(1)]],
    responsableNombre: ['', [Validators.required, Validators.maxLength(120)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuration']) {
      const config = changes['configuration'].currentValue as ScoringConfiguration | null;
      if (config) {
        this.form.patchValue({
          numeroIteraciones: config.numeroIteraciones,
          responsableNombre: config.responsableNombre,
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as ScoringConfigurationPayload);
  }
}
