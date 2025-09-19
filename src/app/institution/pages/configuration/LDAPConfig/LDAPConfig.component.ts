import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { InstitutionConfigService } from '@services/institution-config.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ldapconfig',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './LDAPConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LDAPConfigComponent {
  fb = inject(FormBuilder);
  service = inject(InstitutionConfigService);
  editing = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Asumidos — ajustar a InstitutionLDAPSettings real
  form = this.fb.group({
    host: this.fb.control<string>('', { validators: [Validators.required] }),
    port: this.fb.control<number | null>(389, {
      validators: [Validators.required],
    }),
    baseDn: this.fb.control<string>('', { validators: [Validators.required] }),
    bindUser: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    bindPassword: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    useSSL: this.fb.control<boolean>(false),
  });

  enableEdit() {
    this.editing.set(true);
  }

  cancel() {
    // TODO: recargar valores reales desde backend
    this.editing.set(false);
  }

  save() {
    if (this.form.invalid || !this.service.institution()?.id) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.service
      .updateLDAPSettings(
        {
          host: this.form.value.host!,
          port: this.form.value.port!,
          baseDn: this.form.value.baseDn!,
          bindUser: this.form.value.bindUser!,
          bindPassword: this.form.value.bindPassword!,
          useSSL: this.form.value.useSSL!,
        } as any, // sustituir por InstitutionLDAPSettings
        this.service.institution()!.id
      )
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.editing.set(false);
      });
  }
}
