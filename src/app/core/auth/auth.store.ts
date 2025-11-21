import { Injectable, computed, signal } from '@angular/core';

export interface AdminSession {
  id: number;
  email: string;
  nombre: string | null;
  institucion_id: number;
  confirmado: boolean;
}

export interface UsuarioSession {
  id: number;
  email: string;
  nombre: string | null;
  provider: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  admin?: AdminSession;
  usuario?: UsuarioSession;
  gestor?: GestorSession;
}

export interface GestorSession {
  id: number;
  email: string;
  nombre: string | null;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly storage =
    typeof globalThis !== 'undefined' && globalThis.localStorage
      ? globalThis.localStorage
      : null;

  private readonly accessTokenSignal = signal<string | null>(
    this.storage?.getItem('access_token') ?? null
  );
  private readonly tokenTypeSignal = signal<string | null>(
    this.storage?.getItem('token_type') ?? null
  );
  private readonly adminSignal = signal<AdminSession | null>(
    this.readAdminFromStorage()
  );
  private readonly usuarioSignal = signal<UsuarioSession | null>(
    this.readUsuarioFromStorage()
  );
  private readonly gestorSignal = signal<GestorSession | null>(
    this.readGestorFromStorage()
  );

  readonly accessToken = computed(() => this.accessTokenSignal());
  readonly tokenType = computed(() => this.tokenTypeSignal());
  readonly admin = computed(() => this.adminSignal());
  readonly usuario = computed(() => this.usuarioSignal());
  readonly gestor = computed(() => this.gestorSignal());

  setSession(session: AuthSession) {
    this.accessTokenSignal.set(session.accessToken);
    this.tokenTypeSignal.set(session.tokenType);
    this.adminSignal.set(session.admin ?? null);
    this.usuarioSignal.set(session.usuario ?? null);
    this.gestorSignal.set(session.gestor ?? null);

    if (this.storage) {
      this.storage.setItem('access_token', session.accessToken);
      this.storage.setItem('token_type', session.tokenType);
      if (session.admin) {
        this.storage.setItem('admin_session', JSON.stringify(session.admin));
      } else {
        this.storage.removeItem('admin_session');
      }
      if (session.usuario) {
        this.storage.setItem('usuario_session', JSON.stringify(session.usuario));
      } else {
        this.storage.removeItem('usuario_session');
      }
      if (session.gestor) {
        this.storage.setItem('gestor_session', JSON.stringify(session.gestor));
      } else {
        this.storage.removeItem('gestor_session');
      }
    }
  }

  clear() {
    this.accessTokenSignal.set(null);
    this.tokenTypeSignal.set(null);
    this.adminSignal.set(null);
    this.usuarioSignal.set(null);
    this.gestorSignal.set(null);

    if (this.storage) {
      this.storage.removeItem('access_token');
      this.storage.removeItem('token_type');
      this.storage.removeItem('admin_session');
      this.storage.removeItem('usuario_session');
      this.storage.removeItem('gestor_session');
    }
  }

  updateAccessToken(token: string, tokenType?: string | null) {
    const session: AuthSession = {
      accessToken: token,
      tokenType: tokenType ?? this.tokenTypeSignal() ?? 'Bearer',
    };

    const admin = this.adminSignal();
    if (admin) {
      session.admin = admin;
    }

    const usuario = this.usuarioSignal();
    if (usuario) {
      session.usuario = usuario;
    }

    const gestor = this.gestorSignal();
    if (gestor) {
      session.gestor = gestor;
    }

    this.setSession(session);
  }

  private readAdminFromStorage(): AdminSession | null {
    if (!this.storage) {
      return null;
    }

    const raw = this.storage.getItem('admin_session');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AdminSession;
    } catch {
      this.storage.removeItem('admin_session');
      return null;
    }
  }

  private readUsuarioFromStorage(): UsuarioSession | null {
    if (!this.storage) {
      return null;
    }

    const raw = this.storage.getItem('usuario_session');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UsuarioSession;
    } catch {
      this.storage.removeItem('usuario_session');
      return null;
    }
  }

  private readGestorFromStorage(): GestorSession | null {
    if (!this.storage) {
      return null;
    }
    const raw = this.storage.getItem('gestor_session');
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as GestorSession;
    } catch {
      this.storage.removeItem('gestor_session');
      return null;
    }
  }
}
