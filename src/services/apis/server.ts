import client from '@/services/apis/client';
import { type Packet } from '@/types/packet';
import { type Configuration, type Server, type Servers } from '@/types/server';

export async function getServers(): Promise<Servers> {
  const response = await client.get<Packet<Servers>>('/servers');
  return response.data.data;
}

export async function getServer(id: string): Promise<Server> {
  const response = await client.get<Packet<Server>>('/servers/' + id);
  return response.data.data;
}

export async function addServer(
  id: string,
  config: Configuration,
): Promise<void> {
  await client.post<Packet<void>>('/servers', {
    id,
    configuration: config,
  });
}

export async function updateConfiguration(
  id: string,
  config: Configuration,
): Promise<void> {
  await client.put<Packet<void>>(`/servers/${id}`, {
    configuration: config,
  });
}

export async function removeServer(id: string): Promise<void> {
  await client.delete<Packet<void>>(`/servers/${id}`);
}

export async function startServer(id: string): Promise<void> {
  await client.post<Packet<void>>(`/servers/${id}/start`);
}

export async function stopServer(id: string): Promise<void> {
  await client.post<Packet<void>>(`/servers/${id}/stop`);
}

export async function restartServer(id: string): Promise<void> {
  await client.post<Packet<void>>(`/servers/${id}/restart`);
}

export async function terminateServer(id: string): Promise<void> {
  await client.post<Packet<void>>(`/servers/${id}/terminate`);
}

export async function inputServer(id: string, input: string): Promise<void> {
  await client.post<Packet<void>>(`/servers/${id}/input`, [input]);
}
export async function getServerHistory(
  id: string,
): Promise<{ type: string; data?: string }[]> {
  const response = await client.get<Packet<{ type: string; data?: string }[]>>(
    `/servers/${id}/history`,
  );
  return response.data.data;
}
