import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActualizarPerfil$Params,
  ActualizarRol$Params,
  CambiarContrasena$Params,
  DesactivarUsuario$Params,
  EliminarTodosUsuarios$Params,
  EliminarUsuario$Params,
  ListarUsuariosConFiltros$Params,
  ObtenerPerfilUsuario$Params,
  ObtenerUsuarioPorId$Params,
  RegistrarUsuarioEnInstitucionAutenticada$Params,
  actualizarPerfil,
  actualizarRol,
  cambiarContrasena,
  desactivarUsuario,
  eliminarTodosUsuarios,
  eliminarUsuario,
  listarUsuariosConFiltros,
  obtenerPerfilUsuario,
  obtenerUsuarioPorId,
  registrarUsuarioEnInstitucionAutenticada,
} from '../functions';
import { ApiResponsePageUsuarioResponse } from '../models/api-response-page-usuario-response';
import { ApiResponseString } from '../models/api-response-string';
import { ApiResponseUsuarioResponse } from '../models/api-response-usuario-response';
import { ApiResponseVoid } from '../models/api-response-void';

import { ApiFacadeBase } from './api-facade.base';

@Injectable({
  providedIn: 'root',
})
export class UsuariosFacade extends ApiFacadeBase {
  registrar(
    params: RegistrarUsuarioEnInstitucionAutenticada$Params
  ): Observable<ApiResponseString> {
    return this.request(registrarUsuarioEnInstitucionAutenticada, params);
  }

  listar(
    params?: ListarUsuariosConFiltros$Params
  ): Observable<ApiResponsePageUsuarioResponse> {
    return this.request(listarUsuariosConFiltros, params);
  }

  obtenerPerfil(
    params?: ObtenerPerfilUsuario$Params
  ): Observable<ApiResponseUsuarioResponse> {
    return this.request(obtenerPerfilUsuario, params);
  }

  obtenerPorId(
    params: ObtenerUsuarioPorId$Params
  ): Observable<ApiResponseUsuarioResponse> {
    return this.request(obtenerUsuarioPorId, params);
  }

  actualizarPerfil(
    params: ActualizarPerfil$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarPerfil, params);
  }

  actualizarRol(
    params: ActualizarRol$Params
  ): Observable<ApiResponseString> {
    return this.request(actualizarRol, params);
  }

  cambiarContrasena(
    params: CambiarContrasena$Params
  ): Observable<ApiResponseString> {
    return this.request(cambiarContrasena, params);
  }

  desactivar(
    params: DesactivarUsuario$Params
  ): Observable<ApiResponseString> {
    return this.request(desactivarUsuario, params);
  }

  eliminar(
    params: EliminarUsuario$Params
  ): Observable<ApiResponseVoid> {
    return this.request(eliminarUsuario, params);
  }

  eliminarTodos(
    params?: EliminarTodosUsuarios$Params
  ): Observable<ApiResponseVoid> {
    return this.request(eliminarTodosUsuarios, params);
  }
}
