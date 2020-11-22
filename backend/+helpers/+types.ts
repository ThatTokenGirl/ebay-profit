export type HttpHeaders = { readonly [key: string]: string | string[] };
export type HttpRequest = {
  readonly url: string;
  readonly method: "GET" | "POST" | "PUT" | "DELETE";
  readonly body?: any;
  readonly headers?: HttpHeaders;
};

export type HttpResponse = {
  readonly url: string;
  readonly status: number;
  readonly statusText?: string;
  readonly contentType?: string;
  readonly body?: any;
};

export type MiddlewareHandler = (req: HttpRequest) => Promise<HttpResponse>;
export type Middleware = (
  req: HttpRequest,
  next: MiddlewareHandler
) => Promise<HttpResponse>;

export type BackendConfig = {
  requester: (req: HttpRequest) => Promise<HttpResponse>;
  logger?: (req: HttpRequest, res: HttpResponse) => any;
  middleware?: Middleware[];
};
