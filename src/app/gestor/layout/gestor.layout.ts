import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-gestor-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <section class="gestor-shell">
      <header class="gestor-shell__header">
        <h1>Panel de Gestores</h1>
        <nav>
          <a routerLink="/gestor" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Dashboard
          </a>
          <a routerLink="/gestor/registrar" routerLinkActive="active">
            Registrar institución
          </a>
        </nav>
      </header>
      <main class="gestor-shell__content">
        <router-outlet />
      </main>
    </section>
  `,
})
export class GestorLayoutComponent {}
