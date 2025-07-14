<script setup lang="ts">
import CardBox from '@/components/CardBox.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { getAppInfo } from '@/services/apis';
import { getCpuInfo, getMemoryStatus, getOS } from '@/services/apis/hardware';
import { getServersWithCache } from '@/services/servers/management';
import { AppInfo } from '@/types/app';
import { CpuInfo, MemoryStatus, OSInfo } from '@/types/hardware';
import { Servers } from '@/types/server';
import {
  mdiChartLine,
  mdiCpu64Bit,
  mdiMemory,
  mdiMonitorDashboard,
  mdiServer,
} from '@mdi/js';
import { onUnmounted, reactive, ref } from 'vue';

const isLoading = ref(false);

const infos: {
  cpu?: CpuInfo;
  memory?: MemoryStatus;
  servers?: Servers;
  app: AppInfo;
  os?: OSInfo;
} = reactive({
  cpu: undefined,
  memory: undefined,
  servers: undefined,
  app: undefined,
  os: undefined,
});

async function update() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  try {
    if (!infos.os) {
      infos.os = await getOS();
    }
    if (!infos.app) {
      infos.app = await getAppInfo();
    }

    infos.cpu = await getCpuInfo();
    infos.memory = await getMemoryStatus();
    infos.servers = await getServersWithCache();
  } finally {
    isLoading.value = false;
  }
}

update();

const timer = setInterval(update, 3000);
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiMonitorDashboard"
        title="总览"
        main
        no-button
      >
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiCpu64Bit"
          :value="infos.cpu?.percentProcessorTime || 0"
          suffix="%"
          label="CPU"
        >
          <span class="text-xs text-gray-500">
            {{ infos.cpu?.name }}
          </span>
        </CardBoxWidget>

        <CardBoxWidget
          color="text-yellow-500"
          :icon="mdiMemory"
          :value="
            infos.memory?.totalPhysical
              ? Math.floor(
                  100 -
                    (100 * infos.memory.availablePhysical) /
                      infos.memory.totalPhysical,
                )
              : 0
          "
          suffix="%"
          label="内存"
        >
          <span class="text-xs text-gray-500">
            {{
              infos.memory?.totalPhysical
                ? `${((infos.memory.totalPhysical - infos.memory.availablePhysical) / 1024 / 1024 / 1024).toFixed(2)} / ${(infos.memory.totalPhysical / 1024 / 1024 / 1024).toFixed(2)} GB`
                : '-/-'
            }}
          </span>
        </CardBoxWidget>

        <CardBoxWidget
          color="text-sky-500"
          label="服务器"
          :icon="mdiServer"
          :value="
            infos.servers
              ? `${Object.entries(infos.servers).filter(([_, server]) => server.status).length} / ${Object.keys(infos.servers).length}`
              : '-/-'
          "
        >
        </CardBoxWidget>
      </div>

      <SectionTitleLineWithButton
        :icon="mdiChartLine"
        title="详细信息"
        no-button
      >
      </SectionTitleLineWithButton>
      <CardBox>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <div>
            <div>
              <b> 系统名称 </b>
            </div>
            <div class="text-gray-500 dark:text-slate-400">
              {{ infos.os?.name || '-' }}
            </div>
          </div>

          <div>
            <div>
              <b> .NET 运行库版本 </b>
            </div>
            <code class="text-gray-500 dark:text-slate-400">
              {{ infos.app?.clrVersion || '-' }}
            </code>
          </div>

          <div>
            <div>
              <b> 进程 Id </b>
            </div>
            <code class="text-gray-500 dark:text-slate-400">
              {{ infos.app?.processId || '-' }}
            </code>
          </div>

          <div>
            <div>
              <b> 后端版本 </b>
            </div>
            <code
              class="text-gray-500 dark:text-slate-400"
              :title="infos.app?.fullVersion"
            >
              Serein.{{ ['Unknown', 'Cli', 'Lite', 'Plus'][infos.app?.type] }}
              {{ infos.app?.version || '-' }}
            </code>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
