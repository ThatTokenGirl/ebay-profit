import { logger as loggerFactory } from "react-native-logs";
import { HttpRequest, HttpResponse } from "./backend";

export const logger = loggerFactory.createLogger();
export function backendLogger(req: HttpRequest, res: HttpResponse) {
  const str = `
URL: ${res.url}
STATUS: ${res.status}
-- REQUEST --
${formatBody(req.body)}
-- RESPONSE --
${formatBody(res.body)}

`;
  logger.log("debug", str);
}

function formatBody(body: any) {
  return JSON.stringify(body || "", null, 2);
}
