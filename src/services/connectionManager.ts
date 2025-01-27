import { useMainStore } from '@/stores/main';
import { DataTranferredEvent } from '@/types/connection';
import { ref } from 'vue';

let ws: WebSocket | null = null;

export const packets = ref<DataTranferredEvent[]>([]);

export function connectWs() {
  if (ws?.readyState === WebSocket.OPEN) {
    return;
  }

  let url =
    (location.protocol === 'https:' ? 'wss://' : 'ws://') +
    `${location.host}/ws/connection`;

  const token = useMainStore().accessToken;

  if (token) {
    url += `&token=${token}`;
  }

  ws = new WebSocket(url);
  ws.addEventListener('message', handleMessage);
  ws.addEventListener('close', handleClose);
}

function handleMessage(ev: MessageEvent) {
  packets.value.push(JSON.parse(ev.data));

  if (packets.value.length > 200) {
    packets.value.shift();
  }
}

function handleClose() {
  setTimeout(() => {
    connectWs();
  }, 500);
}
