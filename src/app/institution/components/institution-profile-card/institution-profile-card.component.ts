import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Institution } from '@domain/interface/institution';
import { User } from '@services/user.service';

@Component({
  selector: 'institution-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './institution-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class InstitutionProfileCardComponent {
  readonly user = input.required<User>();
  readonly institution = input.required<Institution>();

  readonly initials = computed(() => {
    const source =
      this.user().nombreCompleto?.trim() ||
      this.user().nombreUsuario?.trim() ||
      '';
    if (!source) {
      return 'US';
    }

    const parts = source.split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0));
    const initials = letters.join('').toUpperCase();
    if (initials.length) {
      return initials;
    }

    return source.charAt(0).toUpperCase();
  });

  readonly roleLabel = computed(() =>
    this.user().rol === 'MASTER' ? 'Master' : 'Admin'
  );
}
