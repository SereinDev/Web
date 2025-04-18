import client from '@/services/apis/client';
import { type Metadata } from '@/types/metadata';
import { type Packet } from '@/types/packet';

export async function getRoot() {
  return await client.get('/');
}

export async function getMetadata() {
  const response = await client.get<Packet<Metadata>>('/metadata');
  return response.data.data;
}
