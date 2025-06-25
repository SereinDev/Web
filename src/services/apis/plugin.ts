import client from '@/services/apis/client';
import { Packet } from '@/types/packet';
import { Plugins } from '@/types/plugin';

export async function getPlugins(): Promise<Plugins> {
  const response = await client.get<Packet<Plugins>>('/plugins');
  return response.data.data;
}

export async function disablePlugin(id: string): Promise<void> {
  await client.post<Packet<void>>(`/plugins/${id}/disable`);
}

export async function reloadPlugins(): Promise<void> {
  await client.post<Packet<void>>('/plugin-manager/reload');
}
