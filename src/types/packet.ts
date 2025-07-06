export interface Packet<T> {
  data: T;
  errorMsg?: string;
  details: string[];
  time: string;
}

export interface PipePacket {
  type: string;
  data?: string;
  origin?: string;
}
