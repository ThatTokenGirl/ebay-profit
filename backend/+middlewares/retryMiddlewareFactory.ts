import { HttpRequest, Middleware, MiddlewareHandler } from "../+helpers";

export default function retryMiddlewareFactory(
  totalAttempts: number
): Middleware {
  return async (req: HttpRequest, next: MiddlewareHandler) => {
    for (let i = 0; i < totalAttempts; i++) {
      try {
        console.log(`Attempt: ${i + 1}`);
        return await next(req);
      } catch (ex) {
        if (i === totalAttempts - 1) throw ex;
      }
    }

    return {} as any;
  };
}
