import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {
  Institution,
  InstitutionMapper,
  InstitutionsService,
} from '@services/institutions.service';
import { User } from '@services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-xl mx-auto"
    >
      <div>
        <label class="block text-sm font-medium mb-1">Nombre completo</label>
        <input
          formControlName="nombreCompleto"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Nombre de usuario</label>
        <input
          formControlName="nombreUsuario"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Correo</label>
        <input
          formControlName="correo"
          type="email"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div *ngIf="!editMode">
        <label class="block text-sm font-medium mb-1">Contraseña</label>
        <input
          formControlName="contrasena"
          type="password"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1"
          >Institución (opcional)</label
        >
        <select
          formControlName="institutionId"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Sin institución (rol MASTER)</option>
          <option *ngFor="let inst of institutions" [value]="inst.id">
            {{ inst.codigo }} - {{ inst.nombre }}
          </option>
        </select>
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
export class UserFormComponent implements OnChanges {
  @Input() user: User | null = null;
  @Output() add = new EventEmitter<User>();
  form = new FormBuilder().group({
    nombreCompleto: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    institutionId: [''],
  });
  editMode = false;
  institutions: Institution[] = [];
  institutionsService = inject(InstitutionsService);

  ngOnInit() {
    this.institutionsService.getPage(0, 100).subscribe({
      next: (resp) => {
        this.institutions = resp.data.items.map((dto: any) =>
          InstitutionMapper.fromDto(dto)
        );
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        ...this.user,
        institutionId:
          this.user.institutionId !== null
            ? String(this.user.institutionId)
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
        id: this.user?.id ?? null,
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
