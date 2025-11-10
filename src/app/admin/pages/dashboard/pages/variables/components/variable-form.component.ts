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
  Variable,
  VariablePayload,
} from '@services/variable.service';

@Component({
  selector: 'variable-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-emerald-400">
            {{ variable ? 'Editar variable' : 'Nueva variable' }}
          </p>
          <h2 class="text-xl font-semibold text-white">
            {{ variable ? 'Actualiza la información' : 'Registra una nueva variable' }}
          </h2>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 underline-offset-2 hover:text-white"
          *ngIf="variable"
          (click)="onCancel()"
        >
          Cancelar edición
        </button>
      </header>

      <form [formGroup]="form" class="grid gap-4 md:grid-cols-3" (ngSubmit)="onSubmit()">
        <label class="text-sm font-medium text-slate-300 md:col-span-2">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Nombre</span>
          <input
            type="text"
            formControlName="nombre"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="Nombre de la variable"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Tipo</span>
          <input
            type="number"
            formControlName="tipo"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="ID de tipo"
            min="0"
          />
        </label>

        <label class="text-sm font-medium text-slate-300 md:col-span-3">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Descripción</span>
          <textarea
            rows="2"
            formControlName="descripcion"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            placeholder="Describe cómo se utiliza la variable"
          ></textarea>
        </label>

        <div class="md:col-span-3 flex justify-end gap-2">
          <button
            type="button"
            class="rounded border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            (click)="onCancel()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
            [disabled]="form.invalid"
          >
            {{ variable ? 'Actualizar' : 'Registrar' }}
          </button>
        </div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariableFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() variable: Variable | null = null;
  @Output() save = new EventEmitter<VariablePayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: [''],
    tipo: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variable']) {
      const variable = changes['variable'].currentValue as Variable | null;
      if (variable) {
        this.form.patchValue({
          nombre: variable.nombre,
          descripcion: variable.descripcion,
          tipo: variable.tipo,
        });
      } else {
        this.form.reset({
          nombre: '',
          descripcion: '',
          tipo: 0,
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as VariablePayload);
  }

  onCancel() {
    this.cancel.emit();
  }
}
