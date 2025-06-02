import localSettingManager from '@/services/settings/localSettingManager';
import { useMainStore } from '@/stores/main';
import { DataTranferredEvent } from '@/types/connection';
import { ref } from 'vue';

let ws: WebSocket | null = null;

export const events = ref<DataTranferredEvent[]>([]);

export function connectWs() {
  if (ws?.readyState === WebSocket.OPEN) {
    return;
  }

  let url =
    (location.protocol === 'https:' ? 'wss://' : 'ws://') +
    `${location.host}/ws/connection`;

  const token = useMainStore().accessToken;

  if (token) {
    url += `?token=${encodeURIComponent(token)}`;
  }

  ws = new WebSocket(url);
  ws.addEventListener('message', handleMessage);
  ws.addEventListener('close', handleClose);
}

function handleMessage(ev: MessageEvent) {
  events.value.push(JSON.parse(ev.data));

  if (
    events.value.length > localSettingManager.value.value.maxLines.connection
  ) {
    events.value.shift();
  }
}

function handleClose() {
  setTimeout(() => {
    connectWs();
  }, 500);
}
