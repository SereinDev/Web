import { CpuInfo, MemoryStatus, OSInfo } from '@/types/hardware';
import { Match } from '@/types/match';
import { Metadata } from '@/types/metadata';
import { Packet } from '@/types/packet';
import { Server, Servers } from '@/types/server';
import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({ baseURL: '/api' });
const appJsonHeader = {
  'Content-Type': 'application/json',
};

axiosInstance.defaults.headers.delete = appJsonHeader;
axiosInstance.defaults.headers.put = appJsonHeader;
axiosInstance.defaults.headers.post = appJsonHeader;
axiosInstance.interceptors.response.use(undefined, (err) => {
  if (err instanceof AxiosError && err.response)
    throw `${err.response.status} ${err.response.statusText}: ${
      (err.response.data as Packet<any>)?.errorMsg ||
      '未知错误。请查看调试控制台'
    }`;
  throw err;
});

export async function getMetadata() {
  return (await axiosInstance.get<Packet<Metadata>>('/metadata')).data.data;
}

export async function getCpuInfo() {
  return (await axiosInstance.get<Packet<CpuInfo[]>>('/hardware/cpus')).data
    .data[0];
}

export async function getMemoryStatus() {
  return (
    await axiosInstance.get<Packet<MemoryStatus>>('/hardware/memoryStatus')
  ).data.data;
}

export async function getOS() {
  return (await axiosInstance.get<Packet<OSInfo>>('/hardware/os')).data.data;
}

export async function getServers() {
  return (await axiosInstance.get<Packet<Servers>>('/servers')).data.data;
}

export async function getServer(id: string) {
  return (await axiosInstance.get<Packet<Server>>('/servers/' + id)).data.data;
}

export async function startServer(id: string) {
  await axiosInstance.get<Packet<void>>(`/servers/${id}/start`);
}

export async function stopServer(id: string) {
  await axiosInstance.get<Packet<void>>(`/servers/${id}/stop`);
}

export async function terminateServer(id: string) {
  await axiosInstance.get<Packet<void>>(`/servers/${id}/terminate`);
}

export async function inputServer(id: string, input: string) {
  await axiosInstance.post<Packet<void>>(`/servers/${id}/input`, [input]);
}

export async function getMatches() {
  return (await axiosInstance.get<Packet<Match[]>>('/matches')).data.data;
}

export async function addMatch(match: Match) {
  await axiosInstance.post<Packet<void>>('/matches', match);
}

export async function editMatch(id: number, match: Match) {
  await axiosInstance.put<Packet<void>>('/matches/' + id, match);
}

export async function removeMatch(id: number) {
  await axiosInstance.delete<Packet<void>>('/matches/' + id);
}
