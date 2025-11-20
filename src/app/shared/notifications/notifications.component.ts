import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  NotificationService,
  NotificationType,
} from './notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  private readonly notifications = inject(NotificationService);
  readonly messages = computed(() => this.notifications.messages());

  dismiss(id: number) {
    this.notifications.dismiss(id);
  }

  icon(type: NotificationType) {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  }

  bg(type: NotificationType) {
    switch (type) {
      case 'success':
        return 'bg-[#042c19]/90 border-[#1fe27f]';
      case 'error':
        return 'bg-[#2c0404]/90 border-[#fb7185]';
      default:
        return 'bg-[#04182c]/90 border-[#60a5fa]';
    }
  }
}
