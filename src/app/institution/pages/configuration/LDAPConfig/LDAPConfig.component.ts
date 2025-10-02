import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { InstitutionConfigService } from '@services/institution-config.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { InstitutionsService } from '@services/institutions.service';
import { InstitutionLDAPSettings } from '@domain/dtos/institutionLDAP.dto';
import { ConfigSectionComponent } from '../../../components/config-section/config-section.component';
import { ConfigFormActionsComponent } from '../../../components/config-form-actions/config-form-actions.component';

@Component({
  selector: 'app-ldapconfig',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigSectionComponent,
    ConfigFormActionsComponent,
  ],
  templateUrl: './LDAPConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LDAPConfigComponent {
  fb = inject(FormBuilder);
  service = inject(InstitutionConfigService);
  institutionService = inject(InstitutionsService);

  loading = signal<boolean>(true);
  editing = signal<boolean>(false);
  saving = signal<boolean>(false);

  form = this.fb.group({
    ldapHost: this.fb.control<string>('', { validators: [] }),
    ldapPort: this.fb.control<string>('389', {
      validators: [Validators.pattern(/^\d+$/)],
    }),
    ldapBaseDn: this.fb.control<string>('', { validators: [] }),
    ldapUserDn: this.fb.control<string>('', { validators: [] }),
    ldapPassword: this.fb.control<string>('', { validators: [] }),
    useLdap: this.fb.control<boolean>(false),
  });

  private lastLoaded = signal<InstitutionLDAPSettings | null>(null);

  constructor() {
    // El form inicia deshabilitado
    this.form.disable({ emitEvent: false });

    // Reaccionar a cambios de institución (carga inicial)
    effect(() => {
      const inst = this.institutionService.institution();
      if (!inst) return;

      // Patch desde InstitutionResponse (sin password por seguridad)
      const data: InstitutionLDAPSettings = {
        ldapHost: inst.ldapHost ?? '',
        ldapPort: inst.ldapPort ?? '389',
        ldapBaseDn: inst.ldapBaseDn ?? '',
        ldapUserDn: inst.ldapUserDn ?? '',
        ldapPassword: '', // no viene del backend
        useLdap: inst.useLdap ?? false,
      };
      this.lastLoaded.set(data);
      this.form.reset(data, { emitEvent: false });

      // Validadores según useLdap
      this.applyUseLdapValidators(data.useLdap);

      this.editing.set(false);
      this.loading.set(false);
      this.form.disable({ emitEvent: false });
    });

    // Actualizar validadores al togglear useLdap
    this.form.controls.useLdap.valueChanges.subscribe((val) => {
      this.applyUseLdapValidators(!!val);
    });
  }

  private applyUseLdapValidators(required: boolean) {
    const req = required ? [Validators.required] : [];
    this.form.controls.ldapHost.setValidators(req);
    this.form.controls.ldapPort.setValidators(
      required
        ? [Validators.required, Validators.pattern(/^\d+$/)]
        : [Validators.pattern(/^\d+$/)]
    );
    this.form.controls.ldapBaseDn.setValidators(req);
    this.form.controls.ldapUserDn.setValidators(req);
    // Password requerido solo cuando useLdap = true
    this.form.controls.ldapPassword.setValidators(
      required ? [Validators.required] : []
    );
    Object.values(this.form.controls).forEach((c) =>
      c.updateValueAndValidity({ emitEvent: false })
    );
  }

  enableEdit() {
    this.editing.set(true);
    this.form.enable({ emitEvent: false });
  }

  cancel() {
    const last = this.lastLoaded();
    if (last) {
      this.form.reset(last, { emitEvent: false });
      this.applyUseLdapValidators(last.useLdap);
    }
    this.editing.set(false);
    this.form.disable({ emitEvent: false });
  }

  save() {
    const inst = this.institutionService.institution();
    if (!inst?.id) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: InstitutionLDAPSettings = {
      ldapHost: this.form.value.ldapHost ?? '',
      ldapPort: this.form.value.ldapPort ?? '389',
      ldapBaseDn: this.form.value.ldapBaseDn ?? '',
      ldapUserDn: this.form.value.ldapUserDn ?? '',
      ldapPassword: this.form.value.ldapPassword ?? '',
      useLdap: this.form.value.useLdap ?? false,
    };

    // Si se desactiva LDAP, se permite password vacío. Si se activa, debe ser requerido (ya validado).
    this.saving.set(true);
    this.service
      .updateLDAPSettings(payload, inst.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((updatedInst) => {
        // Actualiza cache local de institución
        this.institutionService.institution.update((curr) =>
          curr
            ? {
                ...curr,
                useLdap: payload.useLdap,
                ldapHost: payload.ldapHost,
                ldapPort: payload.ldapPort,
                ldapBaseDn: payload.ldapBaseDn,
                ldapUserDn: payload.ldapUserDn,
                // ldapPassword no se mantiene en el modelo
              }
            : curr
        );
        // Reflejar en el form (limpia password)
        const savedForForm = { ...payload, ldapPassword: '' };
        this.lastLoaded.set(savedForForm);
        this.form.reset(savedForForm, { emitEvent: false });
        this.applyUseLdapValidators(savedForForm.useLdap);

        this.editing.set(false);
        this.form.disable({ emitEvent: false });
      });
  }
}
