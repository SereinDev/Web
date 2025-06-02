import router from '@/router';
import { getServerHistory } from '@/services/apis/server';
import { getServersWithCache } from '@/services/servers/manager';
import { useMainStore } from '@/stores/main';
import { type Server } from '@/types/server';
import localSettingManager from '@/services/settings/localSettingManager';
import { environment } from '@/utils/constants';
import { Ref, ref } from 'vue';
import { useToast } from 'vue-toastification';

class ServerEventPipe {
  public readonly output: Ref<{ type: string; data?: string }[]>;

  private readonly id: string;
  private server: Ref<Server>;
  private ws: WebSocket | null;
  private isStopped = false;

  public constructor(id: string, serverRef: Ref<Server>) {
    this.id = id;
    this.ws = this.createNewWs();
    this.output = ref([]);
    this.server = serverRef;
  }

  private createNewWs() {
    let url =
      (location.protocol === 'https:' ? 'wss://' : 'ws://') +
      `${location.host}/ws/server?id=${encodeURIComponent(this.id)}`;

    const token = useMainStore().accessToken;

    if (token) {
      url += `&token=${encodeURIComponent(token)}`;
    }

    const ws = new WebSocket(url);
    ws.addEventListener('message', (ev) => this.handleMessage(ev));
    ws.addEventListener('close', () => this.onClose());
    ws.addEventListener('open', async () => {
      const history = await getServerHistory(this.id);
      if (!this.server.value?.configuration.outputCommandUserInput) {
        this.output.value = history.filter((line) => line.type !== 'input');
      }

      this.output.value = history;
    });

    return ws;
  }

  private async onClose() {
    if (this.isStopped) {
      return;
    }

    if (!(await getServersWithCache()[this.id])) {
      return;
    }

    setTimeout(() => {
      this.ws = this.createNewWs();
    }, 500);
  }

  public stop() {
    this.isStopped = true;

    setTimeout(() => {
      if (this.isStopped) {
        this.ws?.close();
      }
    }, 5000);
  }

  public restore(serverRef: Ref<Server>) {
    this.server = serverRef;
    this.isStopped = false;

    if (
      this.ws.readyState === WebSocket.CLOSED ||
      this.ws.readyState === WebSocket.CLOSING
    ) {
      this.ws = this.createNewWs();
    }
  }

  private async handlePacket({
    data,
    type,
  }: {
    type:
      | 'started'
      | 'stopped'
      | 'removed'
      | 'input'
      | 'output'
      | 'error'
      | 'info';
    data?: string;
  }) {
    switch (type) {
      case 'started':
        this.output.value = [];
        break;

      case 'stopped':
        if (
          router.currentRoute.value.name === 'server' &&
          router.currentRoute.value.params.id === this.id
        ) {
          useToast().info('服务器已停止');
        }
        break;

      case 'removed':
        this.stop();
        break;

      case 'input':
        if (this.server.value?.configuration.outputCommandUserInput) {
          this.output.value.push({ type, data });
        }
        break;

      case 'info':
      case 'error':
      case 'output':
        this.output.value.push({ type, data });

        break;
    }

    while (
      this.output.value.length > localSettingManager.value.value.maxLines.server
    ) {
      this.output.value.shift();
    }
  }

  private handleMessage(ev: MessageEvent) {
    if (environment === 'development') {
      console.debug(this.id, ev);
    }

    const packet = JSON.parse(ev.data);
    void this.handlePacket(packet);
  }
}

const map = new Map<string, ServerEventPipe>();

export function createServerEventPipe(id: string, server: Ref<Server>) {
  if (map.has(id)) {
    const pipe = map.get(id)!;
    pipe.restore(server);
    return pipe;
  }

  const pipe = new ServerEventPipe(id, server);
  map.set(id, pipe);
  return pipe;
}
