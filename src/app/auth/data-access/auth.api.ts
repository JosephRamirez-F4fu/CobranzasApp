import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StrictHttpResponse } from '../../../api/strict-http-response';
import { loginInstitucionAdminAuthLoginAdminPost } from '../../../api/fn/auth/login-institucion-admin-auth-login-admin-post';
import { loginSsoAuthLoginPost } from '../../../api/fn/auth/login-sso-auth-login-post';
import { loginOauthAdminAuthOauthLoginPost } from '../../../api/fn/auth/login-oauth-admin-auth-oauth-login-post';
import { obtenerUsuarioActualAuthMeGet } from '../../../api/fn/auth/obtener-usuario-actual-auth-me-get';
import { LoginInstitucionAdminRequest } from '../../../api/models/login-institucion-admin-request';
import { LoginSsoRequest } from '../../../api/models/login-sso-request';
import { LoginOAuthAdminRequest } from '../../../api/models/login-o-auth-admin-request';
import { UsuarioResponse } from '../../../api/models/usuario-response';
import { RegistroInstitucionRequest } from '../../../api/models/registro-institucion-request';
import { loginGestorAdminAuthGestorLoginPost } from '../../../api/fn/auth/login-gestor-admin-auth-gestor-login-post';
import { registrarInstitucionPorGestorAuthGestorInstitucionesPost } from '../../../api/fn/auth/registrar-institucion-por-gestor-auth-gestor-instituciones-post';
import { confirmarInstitucionAuthInstitucionesConfirmarPost } from '../../../api/fn/auth/confirmar-institucion-auth-instituciones-confirmar-post';
import { LoginGestorRequest } from '../../../api/models/login-gestor-request';
import { ConfirmarInstitucionRequest } from '../../../api/models/confirmar-institucion-request';

export interface AuthLoginResponse {
  access_token: string;
  token_type: string;
  admin?: {
    id: number;
    email: string;
    nombre: string | null;
    institucion_id: number;
    confirmado: boolean;
  };
  usuario?: UsuarioResponse;
  gestor?: GestorInfo;
}

export interface CurrentUserResponse {
  usuario: UsuarioResponse;
  newAccessToken: string | null;
}

export interface GestorInfo {
  id: number;
  email: string;
  nombre: string | null;
  rol: string;
}

export interface RegistrarInstitucionGestorResponse {
  detail: string;
  gestor_id: number;
  institucion_id: number;
  admin_id: number;
  admin_email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  loginAdmin(payload: LoginInstitucionAdminRequest) {
    return loginInstitucionAdminAuthLoginAdminPost(this.http, this.baseUrl, {
      body: payload,
    }).pipe(map(this.mapResponse));
  }

  loginSso(payload: LoginSsoRequest) {
    return loginSsoAuthLoginPost(this.http, this.baseUrl, {
      body: payload,
    }).pipe(map(this.mapResponse));
  }

  loginOAuth(payload: LoginOAuthAdminRequest) {
    return loginOauthAdminAuthOauthLoginPost(this.http, this.baseUrl, {
      body: payload,
    }).pipe(map(this.mapResponse));
  }

  loginGestor(payload: GestorLoginRequest) {
    return loginGestorAdminAuthGestorLoginPost(this.http, this.baseUrl, {
      body: payload,
    }).pipe(map(this.mapResponse));
  }

  registrarInstitucionConGestor(payload: RegistroInstitucionRequest) {
    return registrarInstitucionPorGestorAuthGestorInstitucionesPost(
      this.http,
      this.baseUrl,
      { body: payload }
    ).pipe(
      map(
        (response) =>
          response.body as unknown as RegistrarInstitucionGestorResponse
      )
    );
  }

  confirmarInstitucion(payload: ConfirmarInstitucionRequest) {
    return confirmarInstitucionAuthInstitucionesConfirmarPost(
      this.http,
      this.baseUrl,
      { body: payload }
    ).pipe(map((response) => response.body));
  }

  private readonly baseUrl = environment.newApiUrl ?? environment.apiUrl;

  private readonly mapResponse = (
    response: StrictHttpResponse<Record<string, unknown>>
  ): AuthLoginResponse => {
    return response.body as unknown as AuthLoginResponse;
  };

  fetchCurrentUser(context?: HttpContext) {
    return obtenerUsuarioActualAuthMeGet(
      this.http,
      this.baseUrl,
      undefined,
      context
    ).pipe(
      map((response) => ({
        usuario: response.body,
        newAccessToken: response.headers.get('X-New-Access-Token'),
      }))
    );
  }
}
