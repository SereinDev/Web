import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const isFieldFocusRegistered = ref(false);

  return { isFieldFocusRegistered };
});
