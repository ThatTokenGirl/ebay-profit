import {
  clone,
  HttpRequest,
  HttpResponse,
  makeRequest,
  set,
} from "../+helpers";
import { EBAY_ENDPOINT, EBAY_APPLICATION_OAUTH_KEY } from "../../environment";

type RequestData = RequestInit & { url: string };

type ValidTokenResponse = {
  valid: true;
  access_token: string;
};

type InvalidTokenResponse = {
  valid: false;
};

type TokenResponse = (ValidTokenResponse | InvalidTokenResponse) & {
  status: number;
};

export default function application_auth<Args extends any[]>(
  requestFactory: (...args: Args) => HttpRequest | Promise<HttpRequest>
): (...args: Args) => Promise<HttpResponse> {
  return async (...args) => {
    const request = await Promise.resolve(requestFactory(...args));

    return makeRequest(request, async (req) => {
      let tokenResponse = await tokenRequest();

      if (!tokenResponse.valid) {
        return new Response(null, {
          status: tokenResponse.status,
        });
      }

      req = clone(req, {
        headers: set(req.headers, {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        }),
      });

      let res = await new Promise<HttpResponse>((resolve, reject) => {
        setTimeout(() => {
          makeRequest(req)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        }, 0);
      });

      if (res.status === 401) {
        tokenResponse = await tokenRequest(true);

        if (!tokenResponse.valid) return res;

        req = clone(req, {
          headers: set(req.headers, {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          }),
        });

        res = await makeRequest(req);
      }

      return res;
    });
  };
}

let _tokenResponsePromise: Promise<TokenResponse>;
async function tokenRequest(
  generateNewToken: boolean = false
): Promise<TokenResponse> {
  _tokenResponsePromise =
    generateNewToken || !_tokenResponsePromise
      ? makeRequest({
          method: "POST",
          url: `${EBAY_ENDPOINT}/identity/v1/oauth2/token`,
          headers: {
            Authorization: `Basic ${EBAY_APPLICATION_OAUTH_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope`,
        }).then((response) => {
          if (response.status !== 200)
            return { valid: false, status: response.status };

          const { access_token }: { access_token: string } = response.body;

          return { valid: true, access_token, status: response.status };
        })
      : _tokenResponsePromise;

  return _tokenResponsePromise;
}
