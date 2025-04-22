import client from '@/services/apis/client';
import { Packet } from '@/types/packet';
import { Configuration, Line, Server, Servers } from '@/types/server';

export async function getServers() {
  const response = await client.get<Packet<Servers>>('/servers');
  return response.data.data;
}

export async function getServer(id: string) {
  const response = await client.get<Packet<Server>>('/servers/' + id);
  return response.data.data;
}

export async function addServer(id: string, config: Configuration) {
  await client.post<Packet<void>>('/servers', {
    id,
    configuration: config,
  });
}

export async function updateConfiguration(id: string, config: Configuration) {
  await client.put<Packet<void>>(`/servers/${id}`, {
    configuration: config,
  });
}

export async function removeServer(id: string) {
  await client.delete<Packet<void>>(`/servers/${id}`);
}

export async function startServer(id: string) {
  await client.post<Packet<void>>(`/servers/${id}/start`);
}

export async function stopServer(id: string) {
  await client.post<Packet<void>>(`/servers/${id}/stop`);
}

export async function terminateServer(id: string) {
  await client.post<Packet<void>>(`/servers/${id}/terminate`);
}

export async function inputServer(id: string, input: string) {
  await client.post<Packet<void>>(`/servers/${id}/input`, [input]);
}
export async function getServerHistory(id: string) {
  const response = await client.get<Packet<Line[]>>(`/servers/${id}/history`);
  return response.data.data;
}
