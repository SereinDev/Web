import router from '@/router';
import { useMainStore } from '@/stores/main';
import { CpuInfo, MemoryStatus, OSInfo } from '@/types/hardware';
import { Match } from '@/types/match';
import { Metadata } from '@/types/metadata';
import { Packet } from '@/types/packet';
import { Schedule } from '@/types/schedule';
import { Configuration, Server, Servers } from '@/types/server';
import axios, { AxiosError } from 'axios';
import { createNotify } from './notification';
import { ConnectionStatus } from '@/types/connection';

const appJsonHeader = {
  'Content-Type': 'application/json',
};

const instance = createInstance();

function createInstance() {
  const axiosInstance = axios.create({ baseURL: '/api' });
  axiosInstance.defaults.headers.post =
    axiosInstance.defaults.headers.put =
    axiosInstance.defaults.headers.delete =
      appJsonHeader;

  axiosInstance.interceptors.request.use((value) => {
    const mainStore = useMainStore();
    if (mainStore.accessToken) {
      value.headers.Authorization = `Bearer ${mainStore.accessToken}`;
    }
    return value;
  });
  axiosInstance.interceptors.response.use(undefined, (err) => {
    if (err instanceof AxiosError && err.response)
      if (
        err.response.status === 401 &&
        err.request instanceof XMLHttpRequest &&
        new URL(err.request.responseURL).pathname !== '/api/'
      ) {
        router.push('/login');
        createNotify({
          title: '需要访问凭证或访问凭证无效',
          type: 'danger',
        });
      }

    if ((err.response.data as Packet<any>)?.errorMsg) {
      throw (err.response.data as Packet<any>)?.errorMsg;
    }

    throw `${err.response.status} ${err.response.statusText}: 未知错误`;
  });

  return axiosInstance;
}

export async function getRoot() {
  return await instance.get('/');
}

export async function getMetadata() {
  return (await instance.get<Packet<Metadata>>('/metadata')).data.data;
}

export async function getCpuInfo() {
  return (await instance.get<Packet<CpuInfo[]>>('/hardware/cpus')).data.data[0];
}

export async function getMemoryStatus() {
  return (await instance.get<Packet<MemoryStatus>>('/hardware/memoryStatus'))
    .data.data;
}

export async function getOS() {
  return (await instance.get<Packet<OSInfo>>('/hardware/os')).data.data;
}

export async function getServers() {
  return (await instance.get<Packet<Servers>>('/servers')).data.data;
}

export async function getServer(id: string) {
  return (await instance.get<Packet<Server>>('/servers/' + id)).data.data;
}

export async function addServer(id: string, config: Configuration) {
  await instance.post<Packet<void>>(`/servers/${id}`, {
    configuration: config,
  });
}

export async function updateServerConfiguration(
  id: string,
  config: Configuration,
) {
  await instance.put<Packet<void>>(`/servers/${id}`, {
    configuration: config,
  });
}

export async function removeServer(id: string) {
  await instance.delete<Packet<void>>(`/servers/${id}`);
}

export async function startServer(id: string) {
  await instance.get<Packet<void>>(`/servers/${id}/start`);
}

export async function stopServer(id: string) {
  await instance.get<Packet<void>>(`/servers/${id}/stop`);
}

export async function terminateServer(id: string) {
  await instance.get<Packet<void>>(`/servers/${id}/terminate`);
}

export async function inputServer(id: string, input: string) {
  await instance.post<Packet<void>>(`/servers/${id}/input`, [input]);
}

export async function getMatches() {
  return (await instance.get<Packet<Match[]>>('/matches')).data.data;
}

export async function addMatch(match: Match) {
  await instance.post<Packet<void>>('/matches', match);
}

export async function editMatch(id: number, match: Match) {
  await instance.put<Packet<void>>('/matches/' + id, match);
}

export async function removeMatch(id: number) {
  await instance.delete<Packet<void>>('/matches/' + id);
}

export async function getSchedules() {
  return (await instance.get<Packet<Schedule[]>>('/schedules')).data.data;
}

export async function addSchedule(schedule: Schedule) {
  await instance.post<Packet<void>>('/schedules', schedule);
}

export async function editSchedule(id: number, schedule: Schedule) {
  await instance.put<Packet<void>>('/schedules/' + id, schedule);
}

export async function removeSchedule(id: number) {
  await instance.delete<Packet<void>>('/schedules/' + id);
}

export async function getConnectionStatus() {
  return (await instance.get<Packet<ConnectionStatus>>('/connection')).data
    .data;
}

export async function openConnection() {
  await instance.get<Packet<ConnectionStatus>>('/connection/open');
}

export async function closeConnection() {
  await instance.get<Packet<ConnectionStatus>>('/connection/close');
}
