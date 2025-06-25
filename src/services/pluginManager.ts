import localSettingManager from '@/services/settings/localSettingManager';
import { WebSocketPipe } from '@/services/webSocketPipe';
import { useMainStore } from '@/stores/main';
import { PipePacket } from '@/types/packet';
import { ref } from 'vue';

export const pipe = new WebSocketPipe(() => {
  let url =
    (location.protocol === 'https:' ? 'wss://' : 'ws://') +
    `${location.host}/ws/plugins`;

  const token = useMainStore().accessToken;

  if (token) {
    url += `?token=${encodeURIComponent(token)}`;
  }

  return url;
});

pipe.start();
pipe.onMessage = (data: MessageEvent) => {
  const packet = JSON.parse(data.data) as PipePacket;
  if (['serein', 'information', 'warning', 'error'].includes(packet.type)) {
    packets.value.push(packet);
  }

  if (packets.value.length > localSettingManager.value.value.maxLines.plugin) {
    packets.value.shift();
  }

  console.log(packets);
};

export const packets = ref<PipePacket[]>([]);
