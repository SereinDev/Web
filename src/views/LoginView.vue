<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import { getRoot } from '@/services/apis';
import { useMainStore } from '@/stores/main';
import { name } from '@/utils/constants';
import { mdiAlert, mdiFormTextboxPassword } from '@mdi/js';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const checked = ref(false);
const mainStore = useMainStore();
const form = reactive({
  accessToken: mainStore.accessToken,
  remember: mainStore.remember,
});

const toast = useToast();
const router = useRouter();

async function submit() {
  const result = await check();
  if (!result) {
    toast.error('网络不佳或登录凭证无效');
  }
}

async function check(): Promise<boolean> {
  try {
    const response = await getRoot();

    if (response.status === 200) {
      router.push({ name: 'overview' });
    }

    return true;
  } catch (error) {
    return false;
  }
}

function update() {
  mainStore.accessToken = form.accessToken;
  mainStore.remember = form.remember;

  localStorage.setItem('serein.remember', String(form.remember));
  if (form.remember) {
    localStorage.setItem('serein.accessToken', form.accessToken);
  } else {
    localStorage.removeItem('serein.accessToken');
  }
}

if (!checked.value) {
  check();
  checked.value = true;
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div class="mb-10">
          <img
            src="/favicon.png"
            class="inline mr-3 select-none"
            style="image-rendering: pixelated; width: 27px; height: 27px"
          />
          <b class="font-black break-keep select-none text-lg">{{ name }}</b>
        </div>
        <FormField label="Authorization Token" help="登录凭证">
          <FormControl
            v-model="form.accessToken"
            :icon="mdiFormTextboxPassword"
            type="password"
            name="password"
            @update:model-value="update"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="保存登录状态"
          title="将Authorization Token保存在本地"
          :input-value="true"
          @update:model-value="update"
        />

        <NotificationBar
          v-if="form.remember"
          class="mt-3"
          :icon="mdiAlert"
          color="warning"
        >
          不要在不受信任的设备上启用此选项
        </NotificationBar>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="登录" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
