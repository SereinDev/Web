import router from '@/router';
import { getServerHistory } from '@/services/apis/server';
import { getServersWithCache } from '@/services/servers/management';
import localSettingManager from '@/services/settings/localSettingManager';
import { WebSocketPipe } from '@/services/webSocketPipe';
import { useMainStore } from '@/stores/main';
import { PipePacket } from '@/types/packet';
import type { Server } from '@/types/server';
import { environment } from '@/utils/constants';
import { Ref, ref } from 'vue';
import { useToast } from 'vue-toastification';

export class ServerEventPipe extends WebSocketPipe {
  public readonly output: Ref<PipePacket[]>;

  private readonly id: string;
  private server: Ref<Server>;

  public constructor(id: string, serverRef: Ref<Server>) {
    super(() => {
      let url =
        (location.protocol === 'https:' ? 'wss://' : 'ws://') +
        `${location.host}/ws/server?` +
        new URLSearchParams({
          id,
          token: useMainStore().accessToken || undefined,
        }).toString();

      return url;
    });

    this.id = id;
    this.output = ref([]);
    this.server = serverRef;

    this.onOpen = async () => {
      const history = await getServerHistory(this.id);
      if (!this.server.value?.configuration.outputCommandUserInput) {
        this.output.value = history.filter((line) => line.type !== 'input');
      }

      this.output.value = history;
    };

    this.onClose = async () => {
      if (!(await getServersWithCache()[this.id])) {
        return;
      }

      this.stop();
    };

    this.onMessage = this.handleMessage;

    this.start();
  }

  public restore(serverRef: Ref<Server>) {
    this.server = serverRef;

    if (
      !this.ws ||
      this.ws.readyState === WebSocket.CLOSED ||
      this.ws.readyState === WebSocket.CLOSING
    ) {
      this.start();
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
    this.handlePacket(packet);
  }
}
