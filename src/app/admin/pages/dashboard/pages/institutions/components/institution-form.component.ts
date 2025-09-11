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
      class="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-xl mx-auto"
    >
      <div>
        <label class="block text-sm font-medium mb-1">Nombre</label>
        <input formControlName="name" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Código</label>
        <input formControlName="code" class="w-full border rounded px-3 py-2" />
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
          formControlName="phoneNumber"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Dirección</label>
        <input
          formControlName="address"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-700 text-white rounded px-4 py-2 mt-2 self-end"
      >
        {{ editMode ? 'Actualizar' : 'Registrar' }}
      </button>
      <button
        *ngIf="editMode"
        type="button"
        (click)="onCancel()"
        class="ml-2 bg-gray-300 text-gray-800 rounded px-3 py-2 mt-2"
      >
        Cancelar
      </button>
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
