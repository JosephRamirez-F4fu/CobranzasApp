import { HttpClient, HttpContext } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

type ApiFn<P, R> = (
  http: HttpClient,
  rootUrl: string,
  params: P,
  context?: HttpContext
) => Observable<StrictHttpResponse<R>>;

type ApiFnOptional<P, R> = (
  http: HttpClient,
  rootUrl: string,
  params?: P,
  context?: HttpContext
) => Observable<StrictHttpResponse<R>>;

export abstract class ApiFacadeBase {
  private readonly config = inject(ApiConfiguration);
  protected readonly http = inject(HttpClient);

  protected request<P, R>(fn: ApiFn<P, R>, params: P, context?: HttpContext): Observable<R>;
  protected request<P, R>(fn: ApiFnOptional<P, R>, params?: P, context?: HttpContext): Observable<R>;
  protected request<P, R>(
    fn: ApiFn<P, R> | ApiFnOptional<P, R>,
    params?: P,
    context?: HttpContext
  ): Observable<R> {
    return (fn as ApiFnOptional<P, R>)(
      this.http,
      this.config.rootUrl,
      params,
      context
    ).pipe(map((response) => response.body));
  }
}
