import { ref } from 'vue';

const defaultSetting: Setting = {
  maxLines: {
    server: 300,
    connection: 300,
    plugin: 300,
  },
};

const value = ref<Setting>(load());

function load(): Setting {
  if (typeof localStorage === 'undefined') {
    return defaultSetting;
  }

  const setting = JSON.parse(
    localStorage.getItem('serein.localSetting') || '{}',
  ) as Setting;

  return {
    ...defaultSetting,
    ...setting,
  };
}

function save(setting: Partial<Setting>) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  value.value = { ...value.value, ...setting };

  localStorage.setItem('serein.localSetting', JSON.stringify(value.value));
}

interface Setting {
  maxLines: {
    server: number;
    connection: number;
    plugin: number;
  };
}

export default { value, save };

save({});
