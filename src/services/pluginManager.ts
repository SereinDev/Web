import localSettingManager from '@/services/settings/localSettingManager';
import { WebSocketPipe } from '@/services/webSocketPipe';
import { PipePacket } from '@/types/packet';
import { ref } from 'vue';

export const pipe = new WebSocketPipe('/ws/plugins');

pipe.startAsync();
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
