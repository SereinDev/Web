<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import CardBoxComponentHeader from '@/components/CardBoxComponentHeader.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import router from '@/router';
import {
  getFileName,
  getServersWithCache,
} from '@/services/servers/management';
import { Server } from '@/types/server';
import {
  mdiFileOutline,
  mdiInformation,
  mdiLoading,
  mdiPlus,
  mdiRefresh,
  mdiServerOutline,
} from '@mdi/js';
import { Ref, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';

const servers: Ref<[string, Server][]> = ref([]);
const toast = useToast();
const isLoading = ref(false);

async function update(refresh: boolean = false) {
  if (isLoading.value) {
    return;
  }

  try {
    isLoading.value = true;
    servers.value = Object.entries(await getServersWithCache(refresh));
  } catch (error) {
    servers.value = [];
    toast.error('获取服务器失败，原因：' + String(error));
  }
  isLoading.value = false;
}

update();
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiServerOutline" title="服务器" main>
        <BaseButtons>
          <BaseButton
            :icon="mdiPlus"
            color="whiteDark"
            title="添加"
            @click="
              () =>
                router.push({ name: 'configuration', params: { id: ':new' } })
            "
          />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            :disabled="isLoading"
            @click="() => update(true)"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>
      <LoadingContainer class="min-h-80" :is-loading="isLoading">
        <div
          v-if="servers.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        >
          <RouterLink
            v-for="server in servers"
            :key="server[0]"
            :to="{ name: 'server', params: { id: server[0] } }"
            class="m-3"
          >
            <CardBox
              has-component-layout
              :class="[
                'border',
                'border-gray-300',
                'hover:border-gray-500',
                'dark:border-slate-600',
                'hover:dark:border-slate-200',
                'transition-border',
                'duration-200',
                'cursor-pointer',
              ]"
              rounded="rounded-xl"
            >
              <CardBoxComponentHeader
                :title="server[1].configuration.name ?? '未命名'"
              >
                <span class="text-gray-500 font-medium text-xs ml-3 break-all">
                  ({{ server[0] }})
                </span>
              </CardBoxComponentHeader>

              <div class="m-3">
                <div
                  class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                >
                  <span class="ml-2">
                    <span
                      :class="[
                        server[1].status ? 'text-teal-500' : 'text-gray-500',
                        'mx-1',
                      ]"
                    >
                      ●
                    </span>
                    {{ server[1].status ? '运行中' : '未启动' }}
                  </span>
                </div>
                <div class="flex ml-1.5" title="启动文件">
                  <BaseIcon :path="mdiFileOutline" />
                  <code
                    class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                  >
                    {{ getFileName(server[1]) || '-' }}
                  </code>
                </div>
              </div>
            </CardBox>
          </RouterLink>
        </div>

        <div v-else>
          <NotificationBar
            :icon="mdiInformation"
            color="info"
            :closable="false"
          >
            <b>当前没有服务器配置</b>
            <span class="break-keep m-3">你可以点击右上角的加号创建服务器</span>
          </NotificationBar>
          <CardBoxComponentEmpty message="啥都没有找到哦..." />
        </div>
      </LoadingContainer>
    </SectionMain>
  </LayoutAuthenticated>
</template>
