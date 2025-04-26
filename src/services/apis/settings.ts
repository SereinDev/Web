import client from '@/services/apis/client';
import { Packet } from '@/types/packet';
import { Settings } from '@/types/settings';

export async function getSettings() {
  const response = await client.get<Packet<Settings>>('/settings');
  return response.data.data;
}

export async function updateConnectionSetting(
  setting: Settings['connection'],
): Promise<void> {
  await client.put<Packet<Settings>>('/settings/connection', setting);
}

export async function updateApplicationSetting(
  setting: Settings['application'],
): Promise<void> {
  await client.put<Packet<Settings>>('/settings/application', setting);
}

export async function updateWebApiSetting(
  setting: Settings['webApi'],
): Promise<void> {
  await client.put<Packet<Settings>>('/settings/web-api', setting);
}
