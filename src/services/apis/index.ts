import client from '@/services/apis/client';
import { type Metadata } from '@/types/metadata';
import { type Packet } from '@/types/packet';
import { AxiosResponse } from 'axios';

export async function getRoot(): Promise<AxiosResponse> {
  return await client.get('/');
}

export async function getMetadata(): Promise<Metadata> {
  const response = await client.get<Packet<Metadata>>('/metadata');
  return response.data.data;
}
