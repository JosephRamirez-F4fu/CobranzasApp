import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstitutionConfigService } from '@services/institution-config.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Institution } from '@domain/interface/institution';
import { InstitutionsService } from '@services/institutions.service';
import { ConfigSectionComponent } from '../../../components/config-section/config-section.component';
import { ConfigFormActionsComponent } from '../../../components/config-form-actions/config-form-actions.component';

@Component({
  selector: 'app-institution-config',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigSectionComponent,
    ConfigFormActionsComponent,
  ],
  templateUrl: './institutionConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InstitutionConfigComponent {
  fb = inject(FormBuilder);
  institutionServiceConfig = inject(InstitutionConfigService);
  institutionService = inject(InstitutionsService);
  editing = signal<boolean>(false);
  saving = signal<boolean>(false);
  institution = signal<Institution | null>(null);

  form = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    address: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    phoneNumber: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    email: this.fb.control<string>('', {
      validators: [Validators.email],
    }),
    logoUrl: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    logoLoginUrl: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });
  constructor() {
    this.load();
    this.form.disable();
  }

  load() {
    const inst = this.institutionService.institution();
    if (inst) {
      this.form.reset({
        name: inst.name,
        address: inst.address,
        phoneNumber: inst.phoneNumber,
        email: inst.email,
        logoUrl: inst.logoUrl,
        logoLoginUrl: inst.logoLoginUrl,
      });
    }
  }

  enableEdit() {
    this.editing.set(true);
    this.form.enable();
  }

  cancel() {
    const inst = this.institutionService.institution();
    if (inst) {
      this.form.reset({
        name: inst.name,
        address: inst.address,
        phoneNumber: inst.phoneNumber,
        email: inst.email,
        logoUrl: inst.logoUrl,
        logoLoginUrl: inst.logoLoginUrl,
      });
    }
    this.editing.set(false);
    this.form.disable();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.institutionServiceConfig
      .updateBasic({
        name: this.form.value.name!,
        address: this.form.value.address!,
        phoneNumber: this.form.value.phoneNumber!,
        email: this.form.value.email!,
        logoUrl: this.form.value.logoUrl!,
        logoLoginUrl: this.form.value.logoLoginUrl!,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((res) => {
        this.institutionService.institution.set(res.data);
        this.editing.set(false);
        this.form.disable();
      });
  }
}
