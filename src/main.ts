import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './css/main.css';
import router from './router';
import { darkModeKey, useDarkModeStore } from './stores/darkMode';

const pinia = createPinia();
const darkModeStore = useDarkModeStore(pinia);

if (
  (!localStorage[darkModeKey] &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage[darkModeKey] === '1'
) {
  darkModeStore.set(true);
}

createApp(App).use(router).use(pinia).mount('#app');
