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
import { Perfil, PerfilPayload } from '@services/perfiles.service';

@Component({
  selector: 'perfil-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">
            {{ perfil ? 'Editar perfil' : 'Nuevo perfil' }}
          </p>
          <h2 class="text-xl font-semibold text-white">
            {{ perfil ? 'Actualiza el perfil' : 'Registra un perfil' }}
          </h2>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 underline-offset-2 hover:text-white"
          *ngIf="perfil"
          (click)="onCancel()"
        >
          Cancelar edición
        </button>
      </header>

      <form [formGroup]="form" class="grid gap-4 md:grid-cols-2" (ngSubmit)="onSubmit()">
        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400">Nombre</span>
          <input
            type="text"
            formControlName="nombre"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400"
            >Score mínimo</span
          >
          <input
            type="number"
            formControlName="minScore"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label class="text-sm font-medium text-slate-300">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400"
            >Score máximo</span
          >
          <input
            type="number"
            formControlName="maxScore"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <label class="text-sm font-medium text-slate-300 md:col-span-2">
          <span class="mb-1 block text-xs uppercase tracking-wide text-slate-400"
            >Descripción</span
          >
          <textarea
            rows="2"
            formControlName="descripcion"
            class="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          ></textarea>
        </label>

        <div class="flex justify-end gap-2 md:col-span-2">
          <button
            type="button"
            class="rounded border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            (click)="onCancel()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 disabled:opacity-50"
            [disabled]="form.invalid"
          >
            {{ perfil ? 'Actualizar' : 'Registrar' }}
          </button>
        </div>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() perfil: Perfil | null = null;
  @Output() save = new EventEmitter<PerfilPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: [''],
    minScore: [0, [Validators.required, Validators.min(0)]],
    maxScore: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['perfil']) {
      const value = changes['perfil'].currentValue as Perfil | null;
      if (value) {
        this.form.patchValue({
          nombre: value.nombre,
          descripcion: value.descripcion,
          minScore: value.minScore,
          maxScore: value.maxScore,
        });
      } else {
        this.form.reset({
          nombre: '',
          descripcion: '',
          minScore: 0,
          maxScore: 0,
        });
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as PerfilPayload);
  }

  onCancel() {
    this.cancel.emit();
  }
}
