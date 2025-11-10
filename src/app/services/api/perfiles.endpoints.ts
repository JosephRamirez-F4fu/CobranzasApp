import {
  ApiHost,
  type ApiEndpointConfig,
} from '@shared/api/api-multi-host.service';

export enum PerfilesApiEndpoint {
  Collection = 'perfiles/',
  Detail = 'perfiles',
}

export const PerfilesApiRoutes = {
  collection(suffix = ''): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${PerfilesApiEndpoint.Collection}${suffix}`,
    };
  },
  detail(id: number): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${PerfilesApiEndpoint.Detail}/${id}`,
    };
  },
};
