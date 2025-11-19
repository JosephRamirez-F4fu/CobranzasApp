import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '@shared/api/api.service';
import { MultiHostApiService } from '@shared/api/api-multi-host.service';
import { VariableApiRoutes } from './api/variables.endpoints';

export type VariableType = number;

export interface Variable {
  id: number | null;
  nombre: string;
  descripcion: string;
  tipo: VariableType;
  activo: boolean;
}

export interface VariableFilters {
  page?: number;
  size?: number;
  search?: string;
  activo?: boolean;
  tipo?: VariableType;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface VariableCollection {
  items: Variable[];
  pagination: PaginationMeta;
}

export interface VariablePayload {
  nombre: string;
  descripcion?: string;
  tipo: VariableType;
}

export type VariablePatch = Partial<VariablePayload>;

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  private readonly api = inject(MultiHostApiService);

  getPage(filters: VariableFilters = {}) {
    return this.api
      .get<VariableListResponseDto | null>(
        VariableApiRoutes.collection(this.collectionSuffix(filters))
      )
      .pipe(map((response) => this.mapListResponse(response)));
  }

  getById(id: number) {
    return this.api
      .get<VariableResponseDto | null>(VariableApiRoutes.detail(id))
      .pipe(map((response) => this.mapVariableResponse(response)));
  }

  create(payload: VariablePayload) {
    return this.api
      .post<VariableRequestDto, VariableResponseDto>(
        VariableApiRoutes.collection(),
        VariableMapper.toRequest(payload)
      )
      .pipe(map((response) => this.mapVariableResponse(response)));
  }

  update(id: number, payload: VariablePayload) {
    return this.api
      .put<VariableRequestDto, VariableResponseDto>(
        VariableApiRoutes.detail(id),
        VariableMapper.toRequest(payload)
      )
      .pipe(map((response) => this.mapVariableResponse(response)));
  }

  patch(id: number, changes: VariablePatch) {
    const body = VariableMapper.toPatchRequest(changes);

    if (Object.keys(body).length === 0) {
      throw new Error('Variable patch requires at least one property.');
    }

    return this.api
      .patch<VariablePatchRequest, VariableResponseDto>(
        VariableApiRoutes.detail(id),
        body
      )
      .pipe(map((response) => this.mapVariableResponse(response)));
  }

  delete(id: number) {
    return this.api
      .delete<unknown>(VariableApiRoutes.detail(id))
      .pipe(map((response) => this.mapVoidResponse(response)));
  }

  private mapListResponse(
    response: ApiResponse<VariableListResponseDto | null>
  ): ApiResponse<VariableCollection> {
    const pagination = this.toPagination(response.data?.pagination);
    const items = (response.data?.variables ?? []).map((variable) =>
      VariableMapper.fromDto(variable)
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

  private mapVariableResponse(
    response: ApiResponse<VariableResponseDto | null>
  ): ApiResponse<Variable> {
    return {
      data: VariableMapper.fromDto(response.data),
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

  private collectionSuffix(filters: VariableFilters) {
    const query = this.buildQueryString(filters);
    return query ? `?${query}` : '';
  }

  private buildQueryString(filters: VariableFilters = {}) {
    const params: string[] = [];

    const limit = filters.size ?? 10;
    const pageIndex = filters.page ?? 0;
    params.push(`limit=${this.encode(limit)}`);
    params.push(`skip=${this.encode(pageIndex * limit)}`);

    if (filters.tipo != null) {
      params.push(`tipo=${this.encode(filters.tipo)}`);
    }

    const search = filters.search?.trim();
    if (search) {
      params.push(`search=${this.encode(search)}`);
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

interface VariableResponseDto {
  id?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  tipo?: VariableType | null;
  activo?: boolean | null;
}

interface VariableListResponseDto {
  pagination?: PaginationDto | null;
  variables?: VariableResponseDto[] | null;
}

interface PaginationDto {
  total_items?: number | null;
  total_pages?: number | null;
  current_page?: number | null;
}

interface VariableRequestDto {
  nombre: string;
  descripcion?: string;
  tipo: VariableType;
}

type VariablePatchRequest = Partial<VariableRequestDto>;

class VariableMapper {
  static fromDto(dto?: VariableResponseDto | null): Variable {
    return {
      id: dto?.id ?? null,
      nombre: dto?.nombre ?? '',
      descripcion: dto?.descripcion ?? '',
      tipo: dto?.tipo ?? 0,
      activo: dto?.activo ?? false,
    };
  }

  static toRequest(payload: VariablePayload): VariableRequestDto {
    return {
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? undefined,
      tipo: payload.tipo,
    };
  }

  static toPatchRequest(changes: VariablePatch): VariablePatchRequest {
    const request: VariablePatchRequest = {};

    if (typeof changes.nombre === 'string') {
      request.nombre = changes.nombre;
    }

    if (typeof changes.descripcion === 'string') {
      request.descripcion = changes.descripcion;
    }

    if (typeof changes.tipo === 'number') {
      request.tipo = changes.tipo;
    }

    return request;
  }
}
