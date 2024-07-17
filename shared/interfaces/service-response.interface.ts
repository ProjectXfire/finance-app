import type { StatusCode } from 'hono/utils/http-status';

export interface ServiceResponse<T> {
  data: T;
  error: string | null;
  code: StatusCode;
}
