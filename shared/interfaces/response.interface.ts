export interface IResponse<T> {
  error: string | null;
  data: T;
}
