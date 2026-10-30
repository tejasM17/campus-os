import type { ApiErrorBody } from "./types";

export class ApiError extends Error implements ApiErrorBody {
  code: string;
  details?: unknown;
  request_id?: string;

  constructor(error: ApiErrorBody) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.details = error.details;
    this.request_id = error.request_id;
  }
}
