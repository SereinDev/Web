import client from '@/services/apis/client';
import { ConnectionStatus } from '@/types/connection';
import { Packet } from '@/types/packet';

export async function getConnectionStatus() {
  const response = await client.get<Packet<ConnectionStatus>>('/connection');
  return response.data.data;
}

export async function openConnection() {
  await client.post<Packet<ConnectionStatus>>('/connection');
}

export async function closeConnection() {
  await client.delete<Packet<ConnectionStatus>>('/connection');
}
