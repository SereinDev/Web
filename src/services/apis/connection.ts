import client from '@/services/apis/client';
import { ConnectionStatus } from '@/types/connection';
import { Packet } from '@/types/packet';

export async function getConnectionStatus(): Promise<ConnectionStatus> {
  const response = await client.get<Packet<ConnectionStatus>>('/connection');
  return response.data.data;
}

export async function openConnection(): Promise<void> {
  await client.post<Packet<ConnectionStatus>>('/connection');
}

export async function closeConnection(): Promise<void> {
  await client.delete<Packet<ConnectionStatus>>('/connection');
}
