<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  mdiAccount,
  mdiAlert,
  mdiAsterisk,
  mdiFormTextboxPassword,
} from '@mdi/js';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { name } from '@/utils/constants';

const form = reactive({
  login: 'john.doe',
  pass: 'highly-secure-password-fYjUw-',
  remember: true,
});

const router = useRouter();

const submit = () => {
  router.push('/overview');
};
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
            v-model="form.login"
            :icon="mdiFormTextboxPassword"
            type="password"
            name="password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="保存登录状态"
          title="将Authorization Token保存在本地"
          :input-value="true"
        />

        <NotificationBar
          class="mt-3"
          v-if="form.remember"
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
