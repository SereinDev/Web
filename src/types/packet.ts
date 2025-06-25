export interface Packet<T> {
  code: number;
  data: T;
  errorMsg?: string;
  time: string;
}

export interface PipePacket {
  type: string;
  data?: string;
}
