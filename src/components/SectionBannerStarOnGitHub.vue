<script setup lang="ts">
import { mdiGithub } from '@mdi/js';
import BaseButton from '@/components/BaseButton.vue';
import SectionBanner from '@/components/SectionBanner.vue';
import { gradientBg2 } from '@/colors';
import { repoUrl } from '@/utils/constants';
</script>

<template>
  <SectionBanner :class="gradientBg2">
    <h1 class="text-3xl text-white mb-6">
      喜欢这个项目吗？在 <b>GitHub</b> 上给我们点个 Star 吧！
    </h1>
    <div>
      <BaseButton
        :href="repoUrl"
        :icon="mdiGithub"
        label="GitHub"
        target="_blank"
        rounded-full
      />
    </div>
  </SectionBanner>
</template>
