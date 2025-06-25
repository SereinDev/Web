<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import Console from '@/components/Console.vue';
import FormControl from '@/components/FormControl.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import router from '@/router';
import {
  inputServer,
  startServer,
  stopServer,
  terminateServer,
} from '@/services/apis/server';
import {
  createServerEventPipe,
  getServersWithCache,
} from '@/services/servers/management';
import { Server } from '@/types/server';
import {
  mdiAlert,
  mdiArrowUp,
  mdiConsole,
  mdiFileEditOutline,
  mdiHandBackLeftOutline,
  mdiInformationBoxOutline,
  mdiMinecraft,
  mdiPause,
  mdiPlay,
  mdiRefresh,
  mdiServerNetworkOutline,
  mdiStop,
  mdiText,
  mdiTimelapse,
} from '@mdi/js';
import numeral from 'numeral';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const id = computed(() => router.currentRoute.value.params['id'] as string);
const timer = setInterval(update, 1000);

const server = ref<Server>();
const online = ref(true);
const serverEventPipe = createServerEventPipe(id.value, server);

const input = ref('');
const inputRef = ref<{ inputEl: HTMLElement }>();
const isModalActive = ref(false);

async function update(refresh: boolean = false) {
  try {
    server.value = (await getServersWithCache(refresh))[id.value];
  } catch (error) {
    if (online.value) {
      toast.error('获取服务器失败，原因：' + String(error));
    }

    online.value = false;
  }

  online.value = Boolean(server.value);
}

async function operate(type: 'start' | 'stop' | 'terminate' | 'input') {
  try {
    switch (type) {
      case 'start':
        await startServer(id.value);
        break;

      case 'stop':
        await stopServer(id.value);
        break;

      case 'terminate':
        await terminateServer(id.value);
        break;

      case 'input':
        await inputServer(id.value, input.value);
        input.value = '';
        inputRef.value?.inputEl.focus();
        break;
    }

    if (['start', 'terminate'].includes(type)) {
      toast.success('操作成功');
    }
  } catch (error) {
    toast.error('操作失败，原因：' + String(error));
  }
}

update();
onBeforeUnmount(() => clearInterval(timer));
onBeforeUnmount(() => serverEventPipe?.stop());
</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="isModalActive"
      title="确定要强制结束进程吗"
      button="danger"
      button-label="确认"
      has-cancel
      @confirm="() => operate('terminate')"
    >
      此操作可能导致存档损坏等问题
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiServerNetworkOutline"
        :title="
          server?.configuration.name ? server?.configuration.name : '服务器'
        "
        main
      >
        <BaseButtons>
          <BaseButton
            :icon="mdiFileEditOutline"
            color="whiteDark"
            title="编辑"
            @click="
              () => router.push({ name: 'configuration', params: { id } })
            "
          />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            @click="() => update(true)"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <NotificationBar
        v-if="!online"
        color="warning"
        :icon="mdiAlert"
        class="my-3"
        :closable="false"
      >
        <b>状态异常</b>
        此服务器可能不存在或已经被删除
      </NotificationBar>

      <SectionTitleLineWithButton :icon="mdiText" title="信息" no-button />
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          color="text-sky-500"
          :icon="mdiInformationBoxOutline"
          :value="server?.status ? '运行中' : '未启动'"
          label="状态"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiMinecraft"
          :value="
            server?.status && server?.info.stat
              ? `${server?.info.stat?.currentPlayers}/${server?.info.stat?.maximumPlayers}`
              : '-'
          "
          label="在线人数"
        />
        <CardBoxWidget
          color="text-yellow-500"
          :icon="mdiTimelapse"
          :value="
            server?.status && server?.info.startTime
              ? numeral(
                  (Date.now() - new Date(server?.info.startTime).getTime()) /
                    1000,
                ).format('00:00:00')
              : '-'
          "
          label="运行时长"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiConsole" title="控制台" no-button />
      <CardBox has-component-layout class="overflow-hidden mb-5">
        <Console :datas="serverEventPipe.output.value" type="server" />
      </CardBox>

      <div class="flex w-full">
        <FormControl
          ref="inputRef"
          v-model="input"
          class="w-full mr-4"
          inputmode="text"
          autocomplete="none"
          placeholder="在此输入命令..."
          @keyup.enter.stop="() => operate('input')"
        />
        <BaseButton
          color="whiteDark"
          :icon="mdiArrowUp"
          @click="() => operate('input')"
        />
      </div>

      <SectionTitleLineWithButton
        :icon="mdiHandBackLeftOutline"
        title="操作"
        no-button
      />
      <CardBox>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
          <BaseButton
            color="lightDark"
            :icon="mdiPlay"
            label="启动"
            @click="() => operate('start')"
          />
          <BaseButton
            color="lightDark"
            :icon="mdiPause"
            label="停止"
            @click="() => operate('stop')"
          />
          <BaseButton color="lightDark" :icon="mdiRefresh" label="重启" />
          <BaseButton
            color="danger"
            :icon="mdiStop"
            label="强制结束"
            outline
            @click="() => (isModalActive = true)"
          />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
