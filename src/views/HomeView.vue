<script setup lang="ts">
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { getCpuInfo, getMemoryStatus } from '@/services/request';
import { getServersWithCache } from '@/services/serverManager';
import { CpuInfo, MemoryStatus } from '@/types/hardware';
import { Servers } from '@/types/server';
import {
  mdiCpu64Bit,
  mdiMemory,
  mdiMonitorDashboard,
  mdiServer,
} from '@mdi/js';
import { onUnmounted, reactive } from 'vue';

const infos: { cpu?: CpuInfo; memory?: MemoryStatus; servers?: Servers } =
  reactive({
    cpu: undefined,
    memory: undefined,
    servers: undefined,
  });

async function update() {
  infos.cpu = await getCpuInfo();
  infos.memory = await getMemoryStatus();
  infos.servers = await getServersWithCache();
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
          :title="infos.cpu?.name"
        />
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
          :title="
            infos.memory?.totalPhysical
              ? `${Math.floor((infos.memory.totalPhysical - infos.memory.availablePhysical) / 1024 / 1024)} / ${Math.floor(infos.memory.totalPhysical / 1024 / 1024)} MB`
              : '-/-'
          "
        />
        <CardBoxWidget
          :icon="mdiServer"
          color="text-sky-500"
          label="服务器"
          :value="
            infos.servers
              ? `${Object.entries(infos.servers).filter(([_, server]) => server.status).length} / ${Object.keys(infos.servers).length}`
              : '-/-'
          "
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
