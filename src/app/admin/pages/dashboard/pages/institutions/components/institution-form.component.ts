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

@Component({
  selector: 'institution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-xl mx-auto"
    >
      <div>
        <label class="block text-sm font-medium mb-1">Nombre</label>
        <input
          formControlName="nombre"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Código</label>
        <input
          formControlName="codigo"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          formControlName="email"
          type="email"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Teléfono</label>
        <input
          formControlName="telefono"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Dirección</label>
        <input
          formControlName="direccion"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-700 text-white rounded px-4 py-2 mt-2 self-end"
      >
        {{ editMode ? 'Actualizar' : 'Registrar' }}
      </button>
    </form>
  `,
})
export class InstitutionFormComponent implements OnChanges {
  @Input() institution: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    codigo: string;
  } | null = null;
  @Output() add = new EventEmitter<{
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    codigo: string;
  }>();
  form = new FormBuilder().group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    codigo: ['', Validators.required],
  });
  editMode = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['institution'] && this.institution) {
      this.form.patchValue(this.institution);
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
        nombre: value.nombre ?? '',
        email: value.email ?? '',
        telefono: value.telefono ?? '',
        direccion: value.direccion ?? '',
        codigo: value.codigo ?? '',
      });
      this.form.reset();
      this.editMode = false;
    } else {
      this.form.markAllAsTouched();
    }
  }
}
