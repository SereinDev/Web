import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const isFieldFocusRegistered = ref(false);
  const accessToken = ref<string | null>(
    localStorage.getItem('serein.accessToken'),
  );
  const remember = ref(localStorage.getItem('serein.remember') === 'true');

  return { isFieldFocusRegistered, accessToken, remember };
});
