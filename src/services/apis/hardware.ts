import client from '@/services/apis/client';
import { CpuInfo, MemoryStatus, OSInfo } from '@/types/hardware';
import { Packet } from '@/types/packet';

export async function getCpuInfo(): Promise<CpuInfo> {
  const response = await client.get<Packet<CpuInfo[]>>('/hardware/cpus');
  return response.data.data[0];
}

export async function getMemoryStatus(): Promise<MemoryStatus> {
  const response = await client.get<Packet<MemoryStatus>>(
    '/hardware/memory-status',
  );
  return response.data.data;
}

export async function getOS(): Promise<OSInfo> {
  const response = await client.get<Packet<OSInfo>>('/hardware/os');
  return response.data.data;
}
