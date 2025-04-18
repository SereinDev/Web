import router from '@/router';
import { useMainStore } from '@/stores/main';
import { Packet } from '@/types/packet';
import axios, { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const client = axios.create({ baseURL: '/api' });

client.defaults.headers.post =
  client.defaults.headers.put =
  client.defaults.headers.delete =
    {
      'Content-Type': 'application/json',
    };

client.interceptors.request.use((value) => {
  const mainStore = useMainStore();
  if (mainStore.accessToken) {
    value.headers.Authorization = `Bearer ${mainStore.accessToken}`;
  }
  return value;
});

client.interceptors.response.use(undefined, (err) => {
  if (err instanceof AxiosError && err.response)
    if (
      err.response.status === 401 &&
      err.request instanceof XMLHttpRequest &&
      new URL(err.request.responseURL).pathname !== '/api/'
    ) {
      router.push({ name: 'login' });
      toast.error('需要访问凭证或访问凭证无效');
    }

  if ((err.response.data as Packet<any>)?.errorMsg) {
    throw (err.response.data as Packet<any>)?.errorMsg;
  }

  throw `${err.response.status} ${err.response.statusText}: 未知错误`;
});

export default client;
