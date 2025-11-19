import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@shared/api/api.service';
import { MultiHostApiService } from '@shared/api/api-multi-host.service';
import { PerfilesApiRoutes } from './api/perfiles.endpoints';

export interface Perfil {
  id: number | null;
  nombre: string;
  descripcion: string;
  minScore: number;
  maxScore: number;
  activo: boolean;
}

export interface PerfilFilters {
  page?: number;
  size?: number;
  search?: string;
  activo?: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface PerfilCollection {
  items: Perfil[];
  pagination: PaginationMeta;
}

export interface PerfilPayload {
  nombre: string;
  descripcion?: string;
  minScore: number;
  maxScore: number;
}

export type PerfilPatch = Partial<PerfilPayload> & { activo?: boolean };

@Injectable({
  providedIn: 'root',
})
export class PerfilesService {
  private readonly api = inject(MultiHostApiService);

  getPage(filters: PerfilFilters = {}) {
    return this.api
      .get<PerfilListResponseDto | null>(
        PerfilesApiRoutes.collection(this.collectionSuffix(filters))
      )
      .pipe(map((response) => this.mapListResponse(response)));
  }

  getById(id: number) {
    return this.api
      .get<PerfilResponseDto | null>(PerfilesApiRoutes.detail(id))
      .pipe(map((response) => this.mapPerfilResponse(response)));
  }

  create(payload: PerfilPayload) {
    return this.api
      .post<PerfilRequestDto, PerfilResponseDto>(
        PerfilesApiRoutes.collection(),
        PerfilMapper.toRequest(payload)
      )
      .pipe(map((response) => this.mapPerfilResponse(response)));
  }

  update(id: number, payload: PerfilPayload) {
    return this.api
      .put<PerfilRequestDto, PerfilResponseDto>(
        PerfilesApiRoutes.detail(id),
        PerfilMapper.toRequest(payload)
      )
      .pipe(map((response) => this.mapPerfilResponse(response)));
  }

  patch(id: number, changes: PerfilPatch) {
    const body = PerfilMapper.toPatchRequest(changes);

    if (Object.keys(body).length === 0) {
      throw new Error('Perfil patch requires at least one property.');
    }

    return this.api
      .patch<PerfilPatchRequest, PerfilResponseDto>(
        PerfilesApiRoutes.detail(id),
        body
      )
      .pipe(map((response) => this.mapPerfilResponse(response)));
  }

  delete(id: number) {
    return this.api
      .delete<unknown>(PerfilesApiRoutes.detail(id))
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  private mapListResponse(
    response: ApiResponse<PerfilListResponseDto | null>
  ): ApiResponse<PerfilCollection> {
    const pagination = this.toPagination(response.data?.pagination);
    const items = (response.data?.perfiles ?? []).map((perfil) =>
      PerfilMapper.fromDto(perfil)
    );

    return {
      data: {
        items,
        pagination,
      },
      message: response.message ?? '',
      status: response.status ?? false,
    };
  }

  private mapPerfilResponse(
    response: ApiResponse<PerfilResponseDto | null>
  ): ApiResponse<Perfil> {
    return {
      data: PerfilMapper.fromDto(response.data),
      message: response.message ?? '',
      status: response.status ?? false,
    };
  }

  private mapVoidResponse(response: ApiResponse<unknown>): ApiResponse<void> {
    return {
      data: undefined,
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

  private collectionSuffix(filters: PerfilFilters) {
    const query = this.buildQueryString(filters);
    return query ? `?${query}` : '';
  }

  private buildQueryString(filters: PerfilFilters = {}) {
    const params: string[] = [];

    const limit = filters.size ?? 10;
    const pageIndex = filters.page ?? 0;
    params.push(`limit=${this.encode(limit)}`);
    params.push(`skip=${this.encode(pageIndex * limit)}`);

    if (filters.search?.trim()) {
      params.push(`search=${this.encode(filters.search.trim())}`);
    }

    if (filters.activo != null) {
      params.push(`activo=${this.encode(filters.activo)}`);
    }

    return params.join('&');
  }

  private encode(value: string | number | boolean) {
    return encodeURIComponent(String(value));
  }
}

interface PerfilResponseDto {
  id?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  min_score?: number | null;
  max_score?: number | null;
  activo?: boolean | null;
}

interface PerfilListResponseDto {
  pagination?: PaginationDto | null;
  perfiles?: PerfilResponseDto[] | null;
}

interface PaginationDto {
  total_items?: number | null;
  total_pages?: number | null;
  current_page?: number | null;
}

interface PerfilRequestDto {
  nombre: string;
  descripcion?: string;
  min_score: number;
  max_score: number;
}

type PerfilPatchRequest = Partial<PerfilRequestDto> & { activo?: boolean };

class PerfilMapper {
  static fromDto(dto?: PerfilResponseDto | null): Perfil {
    return {
      id: dto?.id ?? null,
      nombre: dto?.nombre ?? '',
      descripcion: dto?.descripcion ?? '',
      minScore: dto?.min_score ?? 0,
      maxScore: dto?.max_score ?? 0,
      activo: dto?.activo ?? false,
    };
  }

  static toRequest(payload: PerfilPayload): PerfilRequestDto {
    return {
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? undefined,
      min_score: payload.minScore,
      max_score: payload.maxScore,
    };
  }

  static toPatchRequest(changes: PerfilPatch): PerfilPatchRequest {
    const request: PerfilPatchRequest = {};

    if (typeof changes.nombre === 'string') {
      request.nombre = changes.nombre;
    }

    if (typeof changes.descripcion === 'string') {
      request.descripcion = changes.descripcion;
    }

    if (typeof changes.minScore === 'number') {
      request.min_score = changes.minScore;
    }

    if (typeof changes.maxScore === 'number') {
      request.max_score = changes.maxScore;
    }

    if (typeof changes.activo === 'boolean') {
      request.activo = changes.activo;
    }

    return request;
  }
}
