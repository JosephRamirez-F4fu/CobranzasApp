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

@Component({
  selector: 'app-institution-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './institutionConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InstitutionConfigComponent {
  fb = inject(FormBuilder);
  institutionService = inject(InstitutionConfigService);
  editing = signal<boolean>(false);
  saving = signal<boolean>(false);

  get current() {
    return this.institutionService.institution();
  }

  form = this.fb.group({
    name: this.fb.control<string>(this.current?.name ?? '', {
      validators: [Validators.required],
    }),
    address: this.fb.control<string>(this.current?.address ?? ''),
    phoneNumber: this.fb.control<string>(this.current?.phoneNumber ?? ''),
    email: this.fb.control<string>(this.current?.email ?? '', {
      validators: [Validators.email],
    }),
    logoUrl: this.fb.control<string>(this.current?.logoUrl ?? ''),
    logoLoginUrl: this.fb.control<string>(this.current?.logoLoginUrl ?? ''),
  });

  enableEdit() {
    this.editing.set(true);
  }

  cancel() {
    const inst = this.current;
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
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.institutionService
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
        this.institutionService.setInstitution(res.data);
        this.editing.set(false);
      });
  }
}
