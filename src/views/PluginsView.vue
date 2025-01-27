<script setup lang="ts">
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { mdiPuzzleOutline } from '@mdi/js';
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiPuzzleOutline"
        title="插件"
        main
        no-button
      >
      </SectionTitleLineWithButton>
    </SectionMain>
  </LayoutAuthenticated>
</template>
