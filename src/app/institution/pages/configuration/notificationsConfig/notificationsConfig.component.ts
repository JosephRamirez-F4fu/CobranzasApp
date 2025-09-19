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
import { InstitutionNotifications } from '@domain/dtos/institutionNotifications.dto';

type ChannelType = 'ivr' | 'wsp' | 'sms' | 'email';

@Component({
  selector: 'app-notifications-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notificationsConfig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotificationsConfigComponent {
  fb = inject(FormBuilder);
  service = inject(InstitutionConfigService);

  channels: ChannelType[] = ['ivr', 'wsp', 'sms', 'email'];
  selectedChannel = signal<ChannelType>('email');
  editing = signal<boolean>(false);
  saving = signal<boolean>(false);

  form = this.fb.group({
    channel: this.fb.control<ChannelType>('email', {
      validators: [Validators.required],
    }),
    enabled: this.fb.control<boolean>(true),
    template: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    subject: this.fb.control<string>(''), // opcional para email
  });

  get currentList() {
    return this.service.notifications();
  }

  constructor() {
    this.form.controls.channel.valueChanges.subscribe((c) => {
      if (c) this.loadChannel(c);
    });
    this.loadChannel(this.selectedChannel());
  }

  private findChannel(c: ChannelType) {
    return this.currentList.find((n: any) => n.channel === c);
  }

  loadChannel(channel: ChannelType) {
    this.selectedChannel.set(channel);
    const existing = this.findChannel(channel);
    if (existing) {
      this.form.patchValue({
        channel: channel,
        enabled: (existing as any).enabled ?? true,
        template: (existing as any).template ?? '',
        subject: (existing as any).subject ?? '',
      });
    } else {
      this.form.patchValue({
        channel,
        enabled: true,
        template: '',
        subject: '',
      });
    }
    this.editing.set(false);
  }

  selectChannel(c: ChannelType) {
    this.form.controls.channel.setValue(c);
  }

  enableEdit() {
    this.editing.set(true);
  }

  cancel() {
    this.loadChannel(this.selectedChannel());
  }

  save() {
    if (this.form.invalid || !this.service.institution()?.id) {
      this.form.markAllAsTouched();
      return;
    }
    const institutionId = this.service.institution()!.id;
    const existing = this.findChannel(this.selectedChannel());
    const payload: InstitutionNotifications = {
      ...(existing ?? ({} as InstitutionNotifications)),
      channel: this.form.value.channel!,
      enabled: this.form.value.enabled!,
      template: this.form.value.template!,
      subject: this.form.value.subject!,
      institutionId: institutionId,
    } as any; // Ajustar a la forma real del DTO si difiere

    this.saving.set(true);
    const obs = existing
      ? this.service.updateNotifications(payload, (existing as any).id)
      : this.service.addNotification(payload);

    obs.pipe(finalize(() => this.saving.set(false))).subscribe((res: any) => {
      if (!existing) {
        this.service.notifications.set([...this.currentList, res.data]);
      } else {
        this.service.notifications.set(
          this.currentList.map((n: any) =>
            n.id === (existing as any).id ? res.data : n
          )
        );
      }
      this.editing.set(false);
    });
  }
}
