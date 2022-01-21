export type ResponseJsonType<T = any> = {
  data: T;
  message: string;
  code: number;
  url?: string;
};
