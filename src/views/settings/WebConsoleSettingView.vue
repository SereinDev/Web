<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { mdiEarth, mdiFileDocumentCheckOutline } from '@mdi/js';

async function save() {}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiEarth"
        title="网页控制台设置"
        main
        no-button
      >
        <BaseButton
          :icon="mdiFileDocumentCheckOutline"
          color="lightDark"
          label="保存"
          @click="save"
        />
      </SectionTitleLineWithButton>
    </SectionMain>
  </LayoutAuthenticated>
</template>
