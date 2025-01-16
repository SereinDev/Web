export type Packet<T> = {
  code: number;
  data: T;
  errorMsg?: string;
  time: string;
};
