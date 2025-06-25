import { getServers } from '@/services/apis/server';
import { ServerEventPipe } from '@/services/servers/serverEventPipe';
import type { Server, Servers } from '@/types/server';
import { Ref } from 'vue';

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

const map = new Map<string, ServerEventPipe>();

export function createServerEventPipe(id: string, server: Ref<Server>) {
  if (map.has(id)) {
    const pipe = map.get(id)!;
    pipe.restore(server);
    return pipe;
  }

  const pipe = new ServerEventPipe(id, server);
  map.set(id, pipe);
  return pipe;
}
