import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationMessage {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messagesSignal = signal<NotificationMessage[]>([]);
  private counter = 0;

  readonly messages = this.messagesSignal.asReadonly();

  success(message: string, duration = 5000) {
    this.push('success', message, duration);
  }

  error(message: string, duration = 6000) {
    this.push('error', message, duration);
  }

  info(message: string, duration = 4000) {
    this.push('info', message, duration);
  }

  dismiss(id: number) {
    this.messagesSignal.update((items) => items.filter((m) => m.id !== id));
  }

  private push(type: NotificationType, message: string, duration: number) {
    const id = ++this.counter;

    this.messagesSignal.update((items) => [
      ...items,
      { id, type, message } as NotificationMessage,
    ]);

    globalThis.setTimeout(() => this.dismiss(id), duration);
  }
}
