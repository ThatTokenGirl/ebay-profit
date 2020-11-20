import { HttpRequest, HttpResponse, MiddlewareHandler } from "./+types";
import mergeConfigs from "./mergeConfig";

const requester = mergeConfigs(
  async (config, req: HttpRequest): Promise<HttpResponse> => {
    const { middleware = [], requester } = config;

    const action = middleware.length
      ? middleware.reduceRight((handler: MiddlewareHandler, m) => {
          return async (req) => await m(req, handler);
        }, requester)
      : requester;

    const res = await action(req);

    return res;
  }
);

export default function makeRequest(req: HttpRequest): Promise<HttpResponse>;
export default function makeRequest(
  req: HttpRequest,
  handler: MiddlewareHandler
): Promise<HttpResponse>;

export default function makeRequest(
  req: HttpRequest,
  handler?: MiddlewareHandler
): Promise<HttpResponse> {
  return requester({ ...(handler && { middleware: [handler] }) }, req);
}
