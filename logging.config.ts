import {
  HttpRequest,
  HttpResponse,
  logging,
} from "@thattokengirl-utilities/http";
import { logger as loggerFactory } from "react-native-logs";

export const logger = loggerFactory.createLogger();
export const backendLoggerMiddleware = logging({
  requestLogger,
  responseLogger,
  errorLogger,
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

function errorLogger(req: HttpRequest, err: any) {
  console.error(err);
}

function formatBody(body: any) {
  return JSON.stringify(body || "", null, 2);
}
