import { getConfig } from "../+config";
import { Middleware } from "../+helpers";

const logging: Middleware = async (req, next) => {
  const res = await next(req);

  const { logger } = getConfig();

  if (logger) {
    logger(req, res);
  }

  return res;
};

export default logging;
