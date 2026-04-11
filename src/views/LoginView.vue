<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseIcon from '@/components/BaseIcon.vue';
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
import { mdiAlert, mdiFormTextboxPassword, mdiLoading } from '@mdi/js';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const tip = `· Serein.Gui：在设置-网页-权限中管理或查看
· Serein.Console：手动修改 ./Serein/web-authentications.json 文件后重启`;

const isLoading = ref(false);
const useToken = ref(false);
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
    isLoading.value = true;
    const response = await getRoot();

    if (response.status === 200) {
      if (
        typeof router.currentRoute.value.query.redirect === 'string' &&
        router.currentRoute.value.query.redirect != '/login'
      ) {
        router.push(router.currentRoute.value.query.redirect);
      } else {
        router.push({ name: 'overview' });
      }
    }

    return true;
  } catch (error) {
    return false;
  } finally {
    isLoading.value = false;
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
      <div
        v-if="isLoading"
        class="flex justify-center items-center fixed inset-0 z-50 pointer-events-none"
      >
        <BaseIcon
          :path="mdiLoading"
          class="animate-spin text-gray-500 dark:text-gray-400"
          size="50"
          w="20"
          h="20"
        />
      </div>

      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div class="mb-10">
          <img
            src="/favicon.png"
            class="inline mr-3 select-none"
            style="image-rendering: pixelated; width: 27px; height: 27px"
          />
          <b class="font-black break-keep select-none text-lg">{{ name }}</b>
        </div>

        <div v-if="!useToken">
          <FormField
            label="在浏览器的弹出窗口中输入用户名与密码后继续..."
            :help="tip"
          />
        </div>
        <div v-else>
          <FormField label="登录令牌 / Token" :help="tip">
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
            title="将令牌保存在本地"
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
        </div>

        <template #footer>
          <BaseButtons v-if="useToken">
            <BaseButton
              outline
              color="info"
              label="返回"
              class="mr-5"
              @click="useToken = false"
            />
            <BaseButton type="submit" color="info" label="登录" />
          </BaseButtons>

          <div v-else class="">
            <hr />
            <div class="text-xs mt-3 mb-1 text-gray-500">无弹出窗口？</div>
            <div class="flex text-sm">
              <div
                class="hover:text-sky-500 cursor-pointer transition-colors"
                @click="check()"
              >
                重试
              </div>
              <div class="mx-2">|</div>
              <div
                class="hover:text-sky-500 cursor-pointer transition-colors"
                @click="useToken = true"
              >
                使用旧版的令牌登录 →
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
