import { getConfig } from "../+config";
import { HttpRequest, HttpResponse, Middleware } from "../+helpers";

const logging: Middleware = async (req, next) => {
  const res = await next(req);

  const { logger } = getConfig();

  if (logger) {
    logger(req, res);
  }

  return res;
};

type Logger = {
  log: (data: any) => void;
  error: (err: any) => void;
  warn: (message: any) => void;
};

type LoggingMiddlewareFactoryOptions =
  | {
      logger: Logger;
    }
  | {
      requestLogger: (req: HttpRequest) => void;
      responseLogger: (res: HttpResponse) => void;
    };

export default function loggingMiddlewareFactory(
  options: LoggingMiddlewareFactoryOptions
): Middleware {
  const requestLogger: (req: HttpRequest) => void =
    "logger" in options
      ? (req) => options.logger.log(req)
      : options.requestLogger;
  const responseLogger: (res: HttpResponse) => void =
    "logger" in options
      ? (res) => options.logger.log(res)
      : options.responseLogger;

  return async (req, next) => {
    requestLogger(req);

    const res = await next(req);

    responseLogger(res);

    return res;
  };
}
