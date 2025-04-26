import { getSettings } from '@/services/apis/settings';
import { Settings } from '@/types/settings';

let settings: Settings | undefined = undefined;
let date: number = undefined;

export async function getSettingsWithCache(
  refresh: boolean = false,
): Promise<Settings> {
  if (!settings || !date || new Date().getTime() - date > 500 || refresh) {
    const response = await getSettings();
    settings = response;
    date = new Date().getTime();
  }

  return settings;
}
