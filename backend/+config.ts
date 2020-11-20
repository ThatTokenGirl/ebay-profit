import {
  BackendConfig,
  HttpRequest,
  HttpResponse,
  Middleware,
} from "./+helpers/+types";

const defaultRequester = async (req: HttpRequest): Promise<HttpResponse> => {
  const headers = new Headers();

  if (req.contentType) {
    headers.append("Content-Type", req.contentType);
  }

  if (req.headers) {
    Object.entries(req.headers).forEach(([key, value]) => {
      const toadd = value instanceof Array ? value : [value];

      toadd.forEach((value) => headers.append(key, value));
    });
  }

  try {
    const res = await fetch(req.url, {
      method: req.method,
      headers,
      body: req.body,
    });

    const body =
      res.headers.get("Content-Type") === "application/json"
        ? await res.json()
        : await res.text();

    return {
      url: res.url,
      contentType: res.headers.get("Content-Type") || undefined,
      status: res.status,
      statusText: res.statusText,
      body,
    };
  } catch (ex) {
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
