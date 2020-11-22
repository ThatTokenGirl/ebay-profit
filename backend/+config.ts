import {
  BackendConfig,
  HttpRequest,
  HttpResponse,
  Middleware,
} from "./+helpers/+types";
import Axios from "axios";

const defaultRequester = async (req: HttpRequest): Promise<HttpResponse> => {
  const headers = new Headers();

  if (req.headers && !req.headers["Content-Type"]) {
    headers.set("Content-Type", "application/json");
  }

  if (req.headers) {
    Object.entries(req.headers).forEach(([key, value]) => {
      const toadd = value instanceof Array ? value : [value];

      toadd.forEach((value) => headers.append(key, value));
    });
  }

  try {
    const res = await Axios({
      method: req.method ?? "get",
      url: req.url,
      headers: req.headers,
      data: req.body,
    });

    const body = res.data;

    return {
      url: res.config.url ?? "",
      contentType: res.headers["Content-Type"] || undefined,
      status: res.status,
      statusText: res.statusText,
      body,
    };
  } catch (ex) {
    console.log("default requester error");
    console.log(ex);
    throw ex;
  }
};

const defaultConfig: BackendConfig = {
  requester: defaultRequester,
  logger: __DEV__ ? (req, res) => console.log(req, res) : undefined,
};

let config: BackendConfig = { ...defaultConfig };

export function setConfig(configData: Partial<BackendConfig>) {
  config = { ...config, ...configData };
}

export function getConfig() {
  return config;
}

export function addMiddleware(...middleware: Middleware[]) {
  setConfig({
    ...config,
    middleware: [...(config.middleware ?? []), ...middleware],
  });
}

export function removeMiddleware(...middleware: Middleware[]) {
  setConfig({
    ...config,
    middleware: (config.middleware ?? []).filter(
      (m) => !~middleware.findIndex((i) => i === m)
    ),
  });
}
