import App from '@/App.vue';
import router from '@/router';
import { darkModeKey, useDarkModeStore } from '@/stores/darkMode';
import * as Sentry from '@sentry/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import Toast from 'vue-toastification';

import '@/css/main.css';
import 'vue-toastification/dist/index.css';

const pinia = createPinia();
const darkModeStore = useDarkModeStore(pinia);

if (
  (!localStorage[darkModeKey] &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage[darkModeKey] === '1'
) {
  darkModeStore.set(true);
}

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Toast);

Sentry.init({
  app,
  dsn: 'https://be773cfe327c61636f0acb361e007f2c@o4507968791379968.ingest.us.sentry.io/4508641628651520',

  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration(),
  ],

  // @ts-expect-error
  environment: import.meta.env.MODE,

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

app.mount('#app');
