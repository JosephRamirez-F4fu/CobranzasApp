import {
  ApiHost,
  type ApiEndpointConfig,
} from '@shared/api/api-multi-host.service';

export enum ScoringApiEndpoint {
  Logs = 'scoring/logs/',
  LogsExport = 'scoring/logs/exportar/',
  Configuration = 'scoring/configuracion/',
}

export const ScoringApiRoutes = {
  logs(suffix = ''): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${ScoringApiEndpoint.Logs}${suffix}`,
    };
  },
  exportLogs(suffix = ''): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: `${ScoringApiEndpoint.LogsExport}${suffix}`,
    };
  },
  configuration(): ApiEndpointConfig {
    return {
      host: ApiHost.Modern,
      endpoint: ScoringApiEndpoint.Configuration,
    };
  },
};
