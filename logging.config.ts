import { logger as loggerFactory } from "react-native-logs";
import { HttpRequest, HttpResponse, loggingMiddlewareFactory } from "./backend";

export const logger = loggerFactory.createLogger();
export const backendLoggerMiddleware = loggingMiddlewareFactory({
  requestLogger,
  responseLogger,
});

function requestLogger(req: HttpRequest) {
  const str = `
-- REQUEST --
(${req.method ?? "GET"}) ${req.url}
${Object.entries(req.headers ?? {}).reduce(
  (acc, [key, value], index) =>
    `${acc}${index > 0 ? "&" : ""}${key}=${(typeof value === "string"
      ? [value]
      : value
    ).reduce(
      (innerAcc, v, innerIndex) => `${innerAcc}${innerIndex > 0 ? "," : ""}${v}`
    )}`,
  ""
)}
${formatBody(req.body)}
`;

  logger.log("debug", str);
}

function responseLogger(res: HttpResponse) {
  const str = `
-- RESPONSE --
(${res.status}) ${res.url}
${formatBody(res.body)}
`;

  logger.log("debug", str);
}

function formatBody(body: any) {
  return JSON.stringify(body || "", null, 2);
}
