import { Server, Servers } from '@/types/server';
import { getServers } from './request';

let cache: Servers = {};
let lastUpdate: number = 0;

export async function getServersWithCache(
  refresh: boolean = false,
): Promise<Servers> {
  if (lastUpdate + 1000 * 1 < Date.now() || refresh) {
    cache = await getServers();
    lastUpdate = Date.now();
  }
  return cache;
}

export function getFileName(server: Server): string | null {
  const name = server.status
    ? server.info.fileName
    : server.configuration.fileName;

  if (!name) {
    return null;
  }

  const array = name.replaceAll('\\', '/').split('/');
  return array[array.length - 1] || null;
}
