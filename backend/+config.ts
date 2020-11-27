import {
  httpClientFactory,
  fetchRequester,
  Middleware,
  MiddlewareHandler,
} from "@thattokengirl-utilities/http";

let middlewares: Middleware[] = [];

const ebayMiddleware: Middleware = (req, next) => {
  const action = middlewares.length
    ? middlewares.reduceRight((handler: MiddlewareHandler, m) => {
        return async (req) => await m(req, handler);
      }, next)
    : next;

  return action(req);
};

export const httpClient = httpClientFactory(fetchRequester(), ebayMiddleware);

export function addMiddleware(...middleware: Middleware[]) {
  middlewares.push(...middleware);
}

export function removeMiddleware(...middleware: Middleware[]) {
  middlewares = middlewares.filter(
    (m) => !~middleware.findIndex((i) => i === m)
  );
}
