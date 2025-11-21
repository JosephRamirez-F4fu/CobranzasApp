import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-gestor-dashboard-page',
  template: `
    <section class="gestor-dashboard">
      <h2>Bienvenido</h2>
      <p>
        Desde aquí podrás registrar nuevas instituciones y consultar sus estados.
      </p>
      <div class="gestor-dashboard__actions">
        <a routerLink="/gestor/registrar" class="btn-primary">Registrar institución</a>
      </div>
    </section>
  `,
  imports: [CommonModule, RouterLink],
})
export class GestorDashboardPageComponent {}
