import {
  getServer,
  startServer,
  stopServer,
  terminateServer,
} from '@/services/apis/server';
import { getServersWithCache } from '@/services/serverManager';
import { useMainStore } from '@/stores/main';
import { Server } from '@/types/server';
import { ref } from 'vue';

const map = new Map<string, ServerConnection>();

export function getServerConnection(id: string) {
  if (map.has(id)) {
    return map.get(id);
  }

  const connection = new ServerConnection(id);
  map.set(id, connection);
  return connection;
}

class ServerConnection {
  public readonly output = ref<string[]>([]);
  private readonly id: string;
  private disposed = false;
  private ws: WebSocket | null;

  public constructor(id: string) {
    this.id = id;
    this.ws = this.createNewWs();
  }

  private createNewWs() {
    let url =
      (location.protocol === 'https:' ? 'wss://' : 'ws://') +
      `${location.host}/ws/server?id=${this.id}`;

    const token = useMainStore().accessToken;

    if (token) {
      url += `&token=${token}`;
    }

    const ws = new WebSocket(url);
    ws.addEventListener('message', (ev) => this.handleMessage(ev));
    ws.addEventListener('close', () => this.onClose());

    return ws;
  }

  private async onClose() {
    if (this.disposed) {
      return;
    }

    if (!(await getServersWithCache()[this.id])) {
      return;
    }

    setTimeout(() => {
      this.ws = this.createNewWs();
    }, 500);
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

  onStatusChange: (status: boolean) => void;

  private handlePacket({ data, type }: Packet) {
    switch (type) {
      case 'started':
        this.output.value = [];

        if (this.onStatusChange) {
          this.onStatusChange(true);
        }
        break;

      case 'stopped':
        if (this.onStatusChange) {
          this.onStatusChange(false);
        }
        break;

      case 'removed':
        map.delete(this.id);
        this?.dispose();
        break;

      case 'input':
        getServersWithCache().then((servers) => {
          if (servers[this.id].configuration.outputCommandUserInput) {
            this.output.value.push(`> ${data}`);
          }
        });
        break;

      case 'output':
        this.output.value.push(data!);

        while (this.output.value.length > 200) {
          this.output.value.shift();
        }
        break;

      case 'info':
        this.output.value.push(`\x1b[36m[Serein]\x1b[0m ${data}`);
        break;

      case 'error':
        this.output.value.push(`[Error] ${data}`);
        break;
    }
  }

  private handleMessage(ev: MessageEvent) {
    console.debug(this.id, ev);
    const packet: Packet = JSON.parse(ev.data);
    this.handlePacket(packet);
  }
}

declare type Packet = {
  type:
    | 'started'
    | 'stopped'
    | 'removed'
    | 'input'
    | 'output'
    | 'error'
    | 'info';

  data?: string;
};
