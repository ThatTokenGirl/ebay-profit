import { HttpHeaders } from "./+types";

export function append(
  headers: HttpHeaders,
  name: string,
  value: string | string[]
): HttpHeaders {
  const { [name]: current } = headers;

  const newValue = [
    ...(current instanceof Array ? current : !!current ? [current] : []),
    ...(value instanceof Array ? value : [value]),
  ];

  return {
    ...headers,
    [name]: newValue,
  };
}

export function set(
  headers: HttpHeaders | undefined,
  update: HttpHeaders
): HttpHeaders {
  return {
    ...headers,
    ...update,
  };
}
