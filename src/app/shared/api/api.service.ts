import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  post<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.post<TResponse>(`${this.apiUrl}/${endpoint}`, data);
  }

  put<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.put<TResponse>(`${this.apiUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  patch<TRequest, TResponse>(endpoint: string, data: TRequest) {
    return this.http.patch<TResponse>(`${this.apiUrl}/${endpoint}`, data);
  }
}
