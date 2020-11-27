import {
  clone,
  HttpRequest,
  HttpResponse,
  modify,
} from "@thattokengirl-utilities/http";
import { httpClient } from "../+config";
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

const token_url = `${EBAY_ENDPOINT}/identity/v1/oauth2/token`;

export default function application_auth<Args extends any[]>(
  requestFactory: (...args: Args) => HttpRequest | Promise<HttpRequest>
): (...args: Args) => Promise<HttpResponse> {
  return async (...args) => {
    let request = await Promise.resolve(requestFactory(...args));

    let tokenResponse = await tokenRequest();

    if (!tokenResponse.valid) {
      return {
        url: token_url,
        headers: {},
        status: tokenResponse.status,
      };
    }

    request = clone(request, {
      headers: modify(request.headers, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      }),
    });

    let response = await httpClient.request(request);

    if (response.status === 401) {
      tokenResponse = await tokenRequest(true);

      if (!tokenResponse.valid) return response;

      request = clone(request, {
        headers: modify(request.headers, {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        }),
      });

      response = await httpClient.request(request);
    }

    return response;
  };
}

let _tokenResponsePromise: Promise<TokenResponse>;
async function tokenRequest(
  generateNewToken: boolean = false
): Promise<TokenResponse> {
  _tokenResponsePromise =
    generateNewToken || !_tokenResponsePromise
      ? httpClient
          .request({
            method: "POST",
            url: `${EBAY_ENDPOINT}/identity/v1/oauth2/token`,
            headers: {
              Authorization: `Basic ${EBAY_APPLICATION_OAUTH_KEY}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope`,
          })
          .then((response) => {
            if (response.status !== 200)
              return { valid: false, status: response.status };

            const { access_token }: { access_token: string } = response.body;

            return { valid: true, access_token, status: response.status };
          })
      : _tokenResponsePromise;

  return _tokenResponsePromise;
}
