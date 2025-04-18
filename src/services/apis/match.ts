import client from '@/services/apis/client';
import { Match } from '@/types/match';
import { Packet } from '@/types/packet';

export async function getMatches() {
  const response = await client.get<Packet<Match[]>>('/matches');
  return response.data.data;
}

export async function addMatch(match: Match) {
  await client.post<Packet<void>>('/matches', match);
}

export async function editMatch(id: number, match: Match) {
  await client.put<Packet<void>>('/matches/' + id, match);
}

export async function removeMatch(id: number) {
  await client.delete<Packet<void>>('/matches/' + id);
}
