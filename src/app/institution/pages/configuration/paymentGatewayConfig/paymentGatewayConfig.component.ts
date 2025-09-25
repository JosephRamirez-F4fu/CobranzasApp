import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, of, switchMap } from 'rxjs';
import { InstitutionsService } from '@services/institutions.service';
import { PaymentGatewayService } from '@services/paymentGateway.service';
import { PaymentGatewayType } from '@domain/dtos/institutionPaymentGateway.dto';

@Component({
  selector: 'app-payment-gateway-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paymentGatewayConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaymentGatewayConfigComponent {
  private fb = inject(FormBuilder);
  private institutions = inject(InstitutionsService);
  private pg = inject(PaymentGatewayService);

  editing = signal(false);
  saving = signal(false);
  loading = signal(true);
  exists = signal(false);

  // Tipos disponibles para el select
  tipos = Object.values(PaymentGatewayType) as PaymentGatewayType[];

  // Form alineado al DTO del backend
  form = this.fb.group({
    tipo: this.fb.control<PaymentGatewayType | null>(null, {
      validators: [Validators.required],
    }),
    apiPublicKey: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    apiSecret: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    urlBase: this.fb.control<string>('', { validators: [Validators.required] }),
    urlWebhook: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    activo: this.fb.control<boolean>(true),
  });

  // Último valor cargado para restaurar en cancelar
  private lastLoaded = signal<{
    tipo: PaymentGatewayType;
    apiPublicKey: string;
    apiSecret: string;
    urlBase: string;
    urlWebhook: string;
    activo: boolean;
    institutionCode: string;
  } | null>(null);

  constructor() {
    // Deshabilitar inicialmente para evitar edición antes de cargar
    this.form.disable({ emitEvent: false });

    // Cargar datos cuando se tenga la institución
    effect(() => {
      const code = this.institutions.institution()?.code;
      if (code) this.load(code);
    });
  }

  private load(code: string) {
    this.loading.set(true);
    this.pg
      .existePorInstitucion(code)
      .pipe(
        switchMap((exists) => {
          this.exists.set(exists);
          if (!exists) return of(null);
          return this.pg.obtenerPorInstitucion(code);
        }),
        finalize(() => {
          this.loading.set(false);
          this.editing.set(false);
          this.form.disable({ emitEvent: false });
        })
      )
      .subscribe((data) => {
        if (data) {
          // Mapear respuesta -> form
          this.form.patchValue(
            {
              tipo: data.tipo,
              apiPublicKey: data.apiPublicKey,
              apiSecret: data.apiSecret,
              urlBase: data.urlBase,
              urlWebhook: data.urlWebhook,
              activo: data.activo,
            },
            { emitEvent: false }
          );
          this.lastLoaded.set({
            tipo: data.tipo,
            apiPublicKey: data.apiPublicKey,
            apiSecret: data.apiSecret,
            urlBase: data.urlBase,
            urlWebhook: data.urlWebhook,
            activo: data.activo,
            institutionCode: data.institutionCode,
          });
        } else {
          // Nuevo registro: limpiar a valores por defecto
          this.form.reset(
            {
              tipo: null,
              apiPublicKey: '',
              apiSecret: '',
              urlBase: '',
              urlWebhook: '',
              activo: true,
            },
            { emitEvent: false }
          );
          this.lastLoaded.set(null);
        }
      });
  }

  enableEdit() {
    this.editing.set(true);
    this.form.enable({ emitEvent: false });
  }

  cancel() {
    const last = this.lastLoaded();
    if (last) {
      this.form.patchValue(
        {
          tipo: last.tipo,
          apiPublicKey: last.apiPublicKey,
          apiSecret: last.apiSecret,
          urlBase: last.urlBase,
          urlWebhook: last.urlWebhook,
          activo: last.activo,
        },
        { emitEvent: false }
      );
    } else {
      this.form.reset(
        {
          tipo: null,
          apiPublicKey: '',
          apiSecret: '',
          urlBase: '',
          urlWebhook: '',
          activo: true,
        },
        { emitEvent: false }
      );
    }
    this.editing.set(false);
    this.form.disable({ emitEvent: false });
  }

  save() {
    const inst = this.institutions.institution();
    if (!inst?.code) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      apiSecret: this.form.value.apiSecret!,
      apiPublicKey: this.form.value.apiPublicKey!,
      tipo: this.form.value.tipo!,
      urlBase: this.form.value.urlBase!,
      urlWebhook: this.form.value.urlWebhook!,
      institutionCode: inst.code,
      activo: this.form.value.activo ?? true,
    };

    this.saving.set(true);
    const req$ = this.exists()
      ? this.pg.editar(inst.code, payload)
      : this.pg.registrar(payload);

    req$.pipe(finalize(() => this.saving.set(false))).subscribe((resp) => {
      // Actualizar estado local con lo guardado
      this.exists.set(true);
      this.lastLoaded.set({
        tipo: resp.tipo,
        apiPublicKey: resp.apiPublicKey,
        apiSecret: resp.apiSecret,
        urlBase: resp.urlBase,
        urlWebhook: resp.urlWebhook,
        activo: resp.activo,
        institutionCode: resp.institutionCode,
      });
      this.editing.set(false);
      this.form.disable({ emitEvent: false });
    });
  }
}
