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
import {
  MEDIOS_ENVIO,
  MedioEnvio,
  NotificationConfigService,
  NotificacionConfigResponse,
} from '@services/notificationConfig.service';
import { ConfigSectionComponent } from '../../../components/config-section/config-section.component';
import { ConfigFormActionsComponent } from '../../../components/config-form-actions/config-form-actions.component';

@Component({
  selector: 'app-notifications-config',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigSectionComponent,
    ConfigFormActionsComponent,
  ],
  templateUrl: './notificationsConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotificationsConfigComponent {
  private fb = inject(FormBuilder);
  private institutions = inject(InstitutionsService);
  private notif = inject(NotificationConfigService);

  loading = signal(true);
  editing = signal(false);
  saving = signal(false);
  exists = signal(false);

  readonly medios = MEDIOS_ENVIO;
  readonly emailMedio: MedioEnvio = 'EMAIL';
  medioSeleccionado = signal<MedioEnvio>(this.emailMedio);

  form = this.fb.group({
    medioEnvio: this.fb.control<string>('EMAIL'),
    frecuencia: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    diadDelMes: this.fb.control<number | null>(null, {
      validators: [Validators.min(1), Validators.max(31)],
    }),
    horaEnvio: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
    activo: this.fb.control<boolean>(true),
    mensaje: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    asunto: this.fb.control<string>(''),
  });

  private lastLoaded = signal<NotificacionConfigResponse | null>(null);

  constructor() {
    this.form.disable({ emitEvent: false });

    effect(() => {
      const code = this.institutions.institution()?.code;
      const medio = this.medioSeleccionado();
      if (code) this.load(code, medio);
    });
  }

  private load(code: string, medio: MedioEnvio) {
    this.loading.set(true);
    this.notif
      .existe(code, medio)
      .pipe(
        switchMap((exists) => {
          this.exists.set(exists);
          if (!exists) return of(null);
          return this.notif.obtener(code, medio);
        }),
        finalize(() => {
          this.loading.set(false);
          this.editing.set(false);
          this.form.disable({ emitEvent: false });
        })
      )
      .subscribe((data) => {
        if (data) {
          this.patchForm(data);
          this.lastLoaded.set(data);
        } else {
          this.form.reset(
            {
              medioEnvio: this.medioSeleccionado(),
              frecuencia: '',
              diadDelMes: null,
              horaEnvio: '',
              activo: true,
              mensaje: '',
              asunto: '',
            },
            { emitEvent: false }
          );
          this.lastLoaded.set(null);
        }
      });
  }

  private patchForm(data: NotificacionConfigResponse) {
    this.form.patchValue(
      {
        medioEnvio: data.medioEnvio,
        frecuencia: data.frecuencia,
        diadDelMes: data.diadDelMes,
        horaEnvio: data.horaEnvio,
        activo: data.activo,
        mensaje: data.mensaje,
        asunto: data.asunto,
      },
      { emitEvent: false }
    );
  }

  selectMedio(m: MedioEnvio) {
    if (this.medioSeleccionado() === m) return;
    this.medioSeleccionado.set(m);
  }

  enableEdit() {
    this.editing.set(true);
    this.form.enable({ emitEvent: false });
    this.form.controls.medioEnvio.disable({ emitEvent: false });
  }

  cancel() {
    const data = this.lastLoaded();
    if (data) {
      this.patchForm(data);
    } else {
      this.form.reset(
        {
          medioEnvio: this.medioSeleccionado(),
          frecuencia: '',
          diadDelMes: null,
          horaEnvio: '',
          activo: true,
          mensaje: '',
          asunto: '',
        },
        { emitEvent: false }
      );
    }
    this.editing.set(false);
    this.form.disable({ emitEvent: false });
  }

  save() {
    const inst = this.institutions.institution();
    if (!inst?.code) return;

    if (this.medioSeleccionado() === this.emailMedio) {
      this.form.controls.asunto.addValidators(Validators.required);
      this.form.controls.asunto.updateValueAndValidity({ emitEvent: false });
    } else {
      this.form.controls.asunto.removeValidators(Validators.required);
      this.form.controls.asunto.updateValueAndValidity({ emitEvent: false });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const medio = this.medioSeleccionado();
    const payload = {
      medioEnvio: medio,
      frecuencia: this.form.value.frecuencia!,
      diadDelMes: this.form.value.diadDelMes ?? 1,
      horaEnvio: this.form.value.horaEnvio!,
      activo: this.form.value.activo ?? true,
      mensaje: this.form.value.mensaje!,
      asunto: this.form.value.asunto ?? '',
      institutionCode: inst.code,
      notificationScenarioId: this.lastLoaded()?.notificationScenarioId ?? null,
    };

    this.saving.set(true);
    const req$ = this.exists()
      ? this.notif.editar(inst.code, medio, payload)
      : this.notif.registrar(payload);

    req$.pipe(finalize(() => this.saving.set(false))).subscribe((resp) => {
      this.exists.set(true);
      this.lastLoaded.set(resp);
      this.editing.set(false);
      this.form.disable({ emitEvent: false });
    });
  }
}
