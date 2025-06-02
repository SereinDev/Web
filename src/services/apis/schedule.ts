import client from '@/services/apis/client';
import { type Packet } from '@/types/packet';
import { type Schedule } from '@/types/schedule';

export async function getSchedules(): Promise<Schedule[]> {
  const response = await client.get<Packet<Schedule[]>>('/schedules');
  return response.data.data;
}

export async function addSchedule(schedule: Schedule): Promise<void> {
  await client.post<Packet<void>>('/schedules', schedule);
}

export async function editSchedule(
  id: number,
  schedule: Schedule,
): Promise<void> {
  await client.put<Packet<void>>('/schedules/' + id, schedule);
}

export async function removeSchedule(id: number): Promise<void> {
  await client.delete<Packet<void>>('/schedules/' + id);
}
