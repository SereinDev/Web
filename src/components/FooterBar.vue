<script setup lang="ts">
import { containerMaxW } from '@/config.js';
import BaseLevel from '@/components/BaseLevel.vue';
import { gitInfo } from '@/utils/constants';
</script>

<template>
  <footer class="py-4 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>&copy;2025, SereinDev.</b>
        Powered by
        <a
          href="https://sereindev.github.io/"
          target="_blank"
          class="text-sky-600"
          >Serein
        </a>
        <code :title="gitInfo.sha"> @ {{ gitInfo.shortSha }} </code>
      </div>
    </BaseLevel>
  </footer>
</template>
