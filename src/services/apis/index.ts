import client from '@/services/apis/client';
import { type AppInfo } from '@/types/app';
import { type Packet } from '@/types/packet';
import { AxiosResponse } from 'axios';

export async function getRoot(): Promise<AxiosResponse> {
  return await client.get('/');
}

export async function getAppInfo(): Promise<AppInfo> {
  const response = await client.get<Packet<AppInfo>>('/');
  return response.data.data;
}
