<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import Console from '@/components/Console.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import {
  closeConnection,
  getConnectionStatus,
  openConnection,
} from '@/services/apis/connection';
import { packets, pipe } from '@/services/connection';
import { ConnectionStatus } from '@/types/connection';
import {
  mdiConnection,
  mdiDownloadNetworkOutline,
  mdiInformationBoxOutline,
  mdiRefresh,
  mdiTimelapse,
  mdiToggleSwitch,
  mdiToggleSwitchOff,
  mdiUploadNetworkOutline,
} from '@mdi/js';
import numeral from 'numeral';
import { onBeforeUnmount, ref } from 'vue';
import { useToast } from 'vue-toastification';

const status = ref<ConnectionStatus>({} as ConnectionStatus);
const timer = setInterval(update, 2000);
const toast = useToast();

pipe.start();
onBeforeUnmount(() => clearInterval(timer));
update();

async function update() {
  try {
    status.value = await getConnectionStatus();
  } catch (error) {
    toast.error('获取连接状态失败，原因：' + String(error));
  }
}

async function toggle() {
  try {
    if (status.value.isActive) {
      await closeConnection();
    } else {
      await openConnection();
      packets.value = [];
    }
    status.value = await getConnectionStatus();
  } catch (error) {
    toast.error('切换连接状态失败，原因：' + String(error));
  }
}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiConnection" title="连接" main>
        <BaseButtons>
          <BaseButton
            :icon="status.isActive ? mdiToggleSwitch : mdiToggleSwitchOff"
            color="whiteDark"
            title="切换状态"
            @click="toggle"
          />
          <BaseButton
            :icon="mdiRefresh"
            color="whiteDark"
            title="刷新"
            @click="update"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget
          color="text-yellow-500"
          :icon="mdiInformationBoxOutline"
          :value="status.isActive ? '已连接' : '未连接'"
          label="状态"
        />
        <CardBoxWidget
          color="text-sky-500"
          :icon="mdiUploadNetworkOutline"
          :value="status.isActive ? status.sent : '-'"
          label="已发送消息数"
        />
        <CardBoxWidget
          color="text-orange-500"
          :icon="mdiDownloadNetworkOutline"
          :value="status.isActive ? status.received : '-'"
          label="已接收消息数"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiTimelapse"
          :value="
            status.isActive && status.startedAt
              ? numeral(
                  (Date.now() - new Date(status.startedAt).getTime()) / 1000,
                ).format('00:00:00')
              : '-'
          "
          label="连接时长"
        />
      </div>
      <CardBox has-component-layout class="overflow-hidden mb-5">
        <Console :datas="packets" type="connection" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
