import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { InstitutionConfigService } from '@services/institution-config.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-payment-gateway-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paymentGatewayConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaymentGatewayConfigComponent {
  fb = inject(FormBuilder);
  service = inject(InstitutionConfigService);

  editing = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Suposición de campos (ajustar a InstitutionPaymentGateway real)
  form = this.fb.group({
    provider: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    apiKey: this.fb.control<string>('', { validators: [Validators.required] }),
    secretKey: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    callbackUrl: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    active: this.fb.control<boolean>(true),
  });

  enableEdit() {
    this.editing.set(true);
  }

  cancel() {
    // TODO: recargar valores reales (si se cargan desde backend)
    this.editing.set(false);
  }

  save() {
    if (this.form.invalid || !this.service.institution()?.id) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.service
      .updatePaymentGateway(
        {
          // mapear a DTO real
          provider: this.form.value.provider!,
          apiKey: this.form.value.apiKey!,
          secretKey: this.form.value.secretKey!,
          callbackUrl: this.form.value.callbackUrl!,
          active: this.form.value.active!,
        } as any, // mantener compatibilidad — sustituir por InstitutionPaymentGateway
        this.service.institution()!.id
      )
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.editing.set(false);
      });
  }
}
