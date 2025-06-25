import client from '@/services/apis/client';
import { type Packet } from '@/types/packet';
import { type Settings } from '@/types/settings';

export async function getSettings(): Promise<Settings> {
  const response = await client.get<Packet<Settings>>('/settings');
  return response.data.data;
}

export async function updateConnectionSetting(
  setting: Settings['connection'],
): Promise<void> {
  await client.put<Packet<null>>('/settings/connection', setting);
}

export async function updateApplicationSetting(
  setting: Settings['application'],
): Promise<void> {
  await client.put<Packet<null>>('/settings/application', setting);
}

export async function updateWebApiSetting(
  setting: Settings['webApi'],
): Promise<void> {
  await client.put<Packet<null>>('/settings/web-api', setting);
}

export async function updateReactionSetting(
  setting: Settings['reactions'],
): Promise<void> {
  await client.put<Packet<null>>('/settings/reactions', setting);
}
