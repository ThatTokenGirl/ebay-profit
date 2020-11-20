import { HttpRequest } from "./+types";

export default function clone(
  req: HttpRequest,
  update: Partial<HttpRequest>
): HttpRequest {
  return { ...req, ...update };
}
