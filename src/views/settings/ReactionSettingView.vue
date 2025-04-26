<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { mdiEmoticonOutline, mdiFileDocumentCheckOutline } from '@mdi/js';

async function save() {}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiEmoticonOutline"
        title="反应设置"
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
