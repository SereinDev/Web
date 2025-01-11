<script setup lang="ts">
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { mdiInformationOutline } from '@mdi/js';
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
    </SectionMain>
  </LayoutAuthenticated>
</template>
