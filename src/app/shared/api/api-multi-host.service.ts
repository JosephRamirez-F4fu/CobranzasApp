import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { ApiResponse } from './api.service';

export enum ApiHost {
  Legacy = 'legacy',
  Modern = 'modern',
}

export interface ApiEndpointConfig {
  host: ApiHost;
  endpoint: string;
}

type HostRegistry = Record<ApiHost, string>;

const HOSTS: HostRegistry = {
  [ApiHost.Legacy]: environment.apiUrl,
  [ApiHost.Modern]: environment.newApiUrl,
};

@Injectable({
  providedIn: 'root',
})
export class MultiHostApiService {
  private readonly http = inject(HttpClient);

  get<T>(config: ApiEndpointConfig) {
    return this.http.get<ApiResponse<T>>(this.buildUrl(config));
  }

  post<TRequest, TResponse>(config: ApiEndpointConfig, data: TRequest) {
    return this.http.post<ApiResponse<TResponse>>(this.buildUrl(config), data);
  }

  put<TRequest, TResponse>(config: ApiEndpointConfig, data: TRequest) {
    return this.http.put<ApiResponse<TResponse>>(this.buildUrl(config), data);
  }

  patch<TRequest, TResponse>(config: ApiEndpointConfig, data: TRequest) {
    return this.http.patch<ApiResponse<TResponse>>(this.buildUrl(config), data);
  }

  delete<T>(config: ApiEndpointConfig) {
    return this.http.delete<ApiResponse<T>>(this.buildUrl(config));
  }

  getBlob(config: ApiEndpointConfig) {
    return this.http.get(this.buildUrl(config), { responseType: 'blob' });
  }

  private buildUrl(config: ApiEndpointConfig) {
    const base = HOSTS[config.host];

    if (!base) {
      throw new Error(`API host "${config.host}" is not configured.`);
    }

    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedEndpoint = config.endpoint.startsWith('/')
      ? config.endpoint.slice(1)
      : config.endpoint;

    return `${normalizedBase}/${normalizedEndpoint}`;
  }
}
