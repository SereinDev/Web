import client from '@/services/apis/client';
import { type Packet } from '@/types/packet';
import { type AutomationTask } from '@/types/automation';

export async function getAutomations(): Promise<AutomationTask[]> {
  const response = await client.get<Packet<AutomationTask[]>>('/automations');
  return response.data.data;
}

export async function addAutomation(task: AutomationTask): Promise<void> {
  await client.post<Packet<void>>('/automations', task);
}

export async function editAutomation(
  id: number,
  task: AutomationTask,
): Promise<void> {
  await client.put<Packet<void>>('/automations/' + id, task);
}

export async function removeAutomation(id: number): Promise<void> {
  await client.delete<Packet<void>>('/automations/' + id);
}
