import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import {
  SocialLoginFacade,
  SocialProvider,
} from '../../data-access/social-login.facade';

@Component({
  selector: 'app-social-login-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-login-buttons.component.html',
})
export class SocialLoginButtonsComponent {
  private readonly facade = inject(SocialLoginFacade);

  @Input() email: string | null = null;

  readonly isLoading = computed(() => this.facade.status() === 'loading');
  readonly errorMessage = this.facade.errorMessage;

  login(provider: SocialProvider) {
    this.facade.login(provider, this.email);
  }
}
