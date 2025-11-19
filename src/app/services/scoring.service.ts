import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@shared/api/api.service';
import { MultiHostApiService } from '@shared/api/api-multi-host.service';
import { ScoringApiRoutes } from './api/scoring.endpoints';

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ScoringLog {
  perfil: string;
  cuenta: string;
  score: number;
  fechaCalculo: string;
}

export interface ScoringLogCollection {
  items: ScoringLog[];
  pagination: PaginationMeta;
}

export interface ScoringLogFilters {
  page?: number;
  size?: number;
  perfil?: string;
  cuenta?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ScoringConfiguration {
  numeroIteraciones: number;
  responsableNombre: string;
}

export interface ScoringConfigurationPayload {
  numeroIteraciones: number;
  responsableNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  private readonly api = inject(MultiHostApiService);

  getLogs(filters: ScoringLogFilters = {}) {
    return this.api
      .get<ScoringLogListResponseDto | null>(
        ScoringApiRoutes.logs(this.logsSuffix(filters))
      )
      .pipe(map((response) => this.mapLogsResponse(response)));
  }

  exportLogs(filters: ScoringLogFilters = {}) {
    return this.api.getBlob(
      ScoringApiRoutes.exportLogs(this.logsSuffix(filters))
    );
  }

  getConfiguration() {
    return this.api
      .get<ScoringConfigurationDto | null>(ScoringApiRoutes.configuration())
      .pipe(map((response) => this.mapConfigurationResponse(response)));
  }

  updateConfiguration(payload: ScoringConfigurationPayload) {
    return this.api
      .put<ScoringConfigurationRequestDto, ScoringConfigurationDto | null>(
        ScoringApiRoutes.configuration(),
        ScoringConfigurationMapper.toRequest(payload)
      )
      .pipe(map((response) => this.mapConfigurationResponse(response)));
  }

  private mapLogsResponse(
    response: ApiResponse<ScoringLogListResponseDto | null>
  ): ApiResponse<ScoringLogCollection> {
    const pagination = this.toPagination(response.data?.pagination);
    const items = (response.data?.scoring_logs ?? []).map((log) =>
      ScoringLogMapper.fromDto(log)
    );

    return {
      data: { items, pagination },
      message: response.message ?? '',
      status: response.status ?? false,
    };
  }

  private mapConfigurationResponse(
    response: ApiResponse<ScoringConfigurationDto | null>
  ): ApiResponse<ScoringConfiguration> {
    return {
      data: ScoringConfigurationMapper.fromDto(response.data),
      message: response.message ?? '',
      status: response.status ?? false,
    };
  }

  private toPagination(pagination?: PaginationDto | null): PaginationMeta {
    return {
      currentPage: pagination?.current_page ?? 0,
      totalItems: pagination?.total_items ?? 0,
      totalPages: pagination?.total_pages ?? 0,
    };
  }

  private logsSuffix(filters: ScoringLogFilters) {
    const query = this.buildQueryString(filters);
    return query ? `?${query}` : '';
  }

  private buildQueryString(filters: ScoringLogFilters = {}) {
    const params: string[] = [];

    const limit = filters.size ?? 10;
    const pageIndex = filters.page ?? 0;
    params.push(`limit=${this.encode(limit)}`);
    params.push(`skip=${this.encode(pageIndex * limit)}`);

    if (filters.perfil?.trim()) {
      params.push(`perfil=${this.encode(filters.perfil.trim())}`);
    }

    if (filters.cuenta?.trim()) {
      params.push(`cuenta=${this.encode(filters.cuenta.trim())}`);
    }

    const { minDate, maxDate } = this.resolveDateRange(filters);
    params.push(`min_date=${this.encode(minDate)}`);
    params.push(`max_date=${this.encode(maxDate)}`);

    return params.join('&');
  }

  private encode(value: string | number | boolean) {
    return encodeURIComponent(String(value));
  }

  private resolveDateRange(filters: ScoringLogFilters) {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const minDate = filters.fechaInicio ?? this.formatDate(thirtyDaysAgo);
    const maxDate = filters.fechaFin ?? this.formatDate(today);

    return { minDate, maxDate };
  }

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }
}

interface ScoringLogResponseDto {
  perfil?: string | null;
  cod_cuenta?: string | null;
  score?: number | null;
  fecha_calculo?: string | null;
}

interface ScoringLogListResponseDto {
  pagination?: PaginationDto | null;
  scoring_logs?: ScoringLogResponseDto[] | null;
}

interface PaginationDto {
  total_items?: number | null;
  total_pages?: number | null;
  current_page?: number | null;
}

interface ScoringConfigurationDto {
  numero_iteraciones?: number | null;
  responsable_nombre?: string | null;
}

interface ScoringConfigurationRequestDto {
  numero_iteraciones: number;
  responsable_nombre: string;
}

class ScoringLogMapper {
  static fromDto(dto?: ScoringLogResponseDto | null): ScoringLog {
    return {
      perfil: dto?.perfil ?? '',
      cuenta: dto?.cod_cuenta ?? '',
      score: dto?.score ?? 0,
      fechaCalculo: dto?.fecha_calculo ?? '',
    };
  }
}

class ScoringConfigurationMapper {
  static fromDto(dto?: ScoringConfigurationDto | null): ScoringConfiguration {
    return {
      numeroIteraciones: dto?.numero_iteraciones ?? 0,
      responsableNombre: dto?.responsable_nombre ?? '',
    };
  }

  static toRequest(
    payload: ScoringConfigurationPayload
  ): ScoringConfigurationRequestDto {
    return {
      numero_iteraciones: payload.numeroIteraciones,
      responsable_nombre: payload.responsableNombre,
    };
  }
}
