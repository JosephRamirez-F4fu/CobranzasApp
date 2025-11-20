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
}

export interface CurrentUserResponse {
  usuario: UsuarioResponse;
  newAccessToken: string | null;
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
