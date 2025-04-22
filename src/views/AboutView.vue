<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBox from '@/components/CardBox.vue';
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { getMetadata } from '@/services/apis';
import { Metadata } from '@/types/metadata';
import { discussionUrl, docsUrl, gitInfo } from '@/utils/constants';
import {
  mdiBookOpenOutline,
  mdiChatOutline,
  mdiInformationOutline,
} from '@mdi/js';
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
          <code v-if="metadata" class="select-all break-all">
            Serein.{{ metadata?.type }}@{{ metadata?.fullVersion }}
          </code>
          <code v-else> ... </code>
        </div>
      </CardBox>
      <BaseButtons class="mt-3">
        <BaseButton
          label="文档"
          color="whitedark"
          target="_blank"
          rounded-full
          :href="docsUrl"
          :icon="mdiBookOpenOutline"
        />
        <BaseButton
          label="讨论区"
          color="whitedark"
          target="_blank"
          rounded-full
          :href="discussionUrl"
          :icon="mdiChatOutline"
        />
      </BaseButtons>
    </SectionMain>
  </LayoutAuthenticated>
</template>
