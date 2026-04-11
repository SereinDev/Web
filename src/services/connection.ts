import localSettingManager from '@/services/settings/localSettingManager';
import { WebSocketPipe } from '@/services/webSocketPipe';
import { PipePacket } from '@/types/packet';
import { ref } from 'vue';

export const pipe = new WebSocketPipe('/ws/connection');

pipe.startAsync();
pipe.onMessage = (data: MessageEvent) => {
  const packet = JSON.parse(data.data) as PipePacket;
  if (
    ['received', 'sent', 'information', 'warning', 'error'].includes(
      packet.type,
    ) &&
    packet.origin === 'Serein'
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
