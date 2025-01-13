<script setup lang="ts">
import CardBox from '@/components/CardBox.vue';
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { getMetadata } from '@/services/request';
import { Metadata } from '@/types/apis/metadata';
import { gitInfo } from '@/utils/constants';
import { mdiInformationOutline } from '@mdi/js';
import { ref } from 'vue';

const metadata = ref<Metadata>();
getMetadata().then((res) => (metadata.value = res));
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiInformationOutline"
        title="关于"
        main
        no-button
      >
      </SectionTitleLineWithButton>
      <SectionBannerStarOnGitHub class="mt-6 mb-6" />

      <CardBox>
        <div class="mb-5 p-2">
          <div class="font-bold">网页版本</div>
          <code class="select-all break-all">
            {{ gitInfo.branch }}+{{ gitInfo.sha }}
          </code>
        </div>
        <div class="p-2">
          <div class="font-bold">后端版本</div>
          <code class="select-all break-all" v-if="metadata">
            Serein.{{ metadata?.type }}@{{ metadata?.fullVersion }}
          </code>
          <code v-else> ... </code>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
