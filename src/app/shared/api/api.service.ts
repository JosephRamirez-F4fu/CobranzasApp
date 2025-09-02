import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  get<T>(endpoint: string) {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`);
  }

  post<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.post<ApiResponse<TResponse>>(
      `${this.apiUrl}/${endpoint}`,
      data
    );
  }

  put<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.put<ApiResponse<TResponse>>(
      `${this.apiUrl}/${endpoint}`,
      data
    );
  }

  delete<T>(endpoint: string) {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`);
  }

  patch<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.patch<ApiResponse<TResponse>>(
      `${this.apiUrl}/${endpoint}`,
      data
    );
  }
}
