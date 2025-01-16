import { useMainStore } from '@/stores/main';
import { Server } from '@/types/server';
import {
  getServer,
  startServer,
  stopServer,
  terminateServer,
} from '@/services/request';

export default class ServerConnection {
  private readonly id: string;
  private ws: WebSocket | null;

  public constructor(id: string) {
    this.id = id;
    this.ws = this.createNewWs();
  }

  private createNewWs() {
    let url =
      (location.protocol === 'https:' ? 'wss://' : 'ws://') +
      `${location.host}/broadcast?id=${this.id}`;

    const token = useMainStore().accessToken;

    if (token) {
      url += `&token=${token}`;
    }

    const ws = new WebSocket(url);
    ws.addEventListener('message', this.handleMessage);
    ws.addEventListener('open', this.onopen);
    ws.addEventListener('close', this.onclose);

    return ws;
  }

  public async update(): Promise<Server> {
    return await getServer(this.id);
  }

  public async start() {
    await startServer(this.id);
  }

  public async stop() {
    await stopServer(this.id);
  }

  public async terminate() {
    await terminateServer(this.id);
  }

  public dispose() {
    this?.ws?.close();
  }

  onopen: () => void;
  onclose: () => void;
  onerror: (title: string, msg: string) => void;

  private handleMessage(ev: MessageEvent) {
    const packet: Packet = JSON.parse(ev.data);
    this.handlePacket(packet);
    console.debug(this.id, packet);
  }

  private handlePacket({ data, type }: Packet) {
    switch (type) {
      case 'Started':
      case 'Stopped':
      case 'Terminated':
      case 'Removed':
      case 'Input':
      case 'Output':
      case 'Error':
      case 'Information':
    }
  }
}

declare type Packet = {
  type:
    | 'Started'
    | 'Stopped'
    | 'Terminated'
    | 'Removed'
    | 'Input'
    | 'Output'
    | 'Error'
    | 'Information';

  data?: string;
};
