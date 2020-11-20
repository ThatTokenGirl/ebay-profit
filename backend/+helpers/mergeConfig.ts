import { getConfig } from "../+config";
import { BackendConfig } from "./+types";

type MergeConfigHandler<Args extends any[], Result> = (
  config: BackendConfig,
  ...args: Args
) => Result;
type MergeConfigOptions = {
  middlewareMerge: "prepend" | "append" | "override";
};

export default function mergeConfigs<Args extends any[], Result>(
  handler: MergeConfigHandler<Args, Result>,
  opts: MergeConfigOptions = { middlewareMerge: "append" }
): (config: Partial<BackendConfig>, ...args: Args) => Result {
  return (config, ...args) => {
    const globalConfigs = getConfig();
    const { middleware: globalMiddleware = [] } = globalConfigs;
    const { middleware: additionalMiddleware = [] } = config;

    const middleware =
      opts.middlewareMerge === "append"
        ? [...globalMiddleware, ...additionalMiddleware]
        : opts.middlewareMerge === "prepend"
        ? [...additionalMiddleware, ...globalMiddleware]
        : additionalMiddleware;

    return handler({ ...globalConfigs, ...config, middleware }, ...args);
  };
}
