import localSettingManager from '@/services/settings/localSettingManager';
import { WebSocketPipe } from '@/services/webSocketPipe';
import { useMainStore } from '@/stores/main';
import { PipePacket } from '@/types/packet';
import { ref } from 'vue';

export const pipe = new WebSocketPipe(() => {
  let url =
    (location.protocol === 'https:' ? 'wss://' : 'ws://') +
    `${location.host}/ws/connection`;

  const token = useMainStore().accessToken;

  if (token) {
    url += `?token=${encodeURIComponent(token)}`;
  }

  return url;
});

pipe.start();
pipe.onMessage = (data: MessageEvent) => {
  const packet = JSON.parse(data.data) as PipePacket;
  if (
    ['received', 'sent', 'information', 'warning', 'error'].includes(
      packet.type,
    )
  ) {
    packets.value.push(packet);
  }

  if (
    packets.value.length > localSettingManager.value.value.maxLines.connection
  ) {
    packets.value.shift();
  }
};

export const packets = ref<PipePacket[]>([]);
