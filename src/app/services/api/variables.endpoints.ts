import {
  ApiHost,
  type ApiEndpointConfig,
} from '@shared/api/api-multi-host.service';

export enum VariableApiEndpoint {
  Collection = 'variables/',
  Detail = 'variables',
}

export const VariableApiRoutes = {
  collection(suffix = ''): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${VariableApiEndpoint.Collection}${suffix}`,
    };
  },
  detail(id: number): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${VariableApiEndpoint.Detail}/${id}`,
    };
  },
};
