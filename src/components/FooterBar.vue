<script setup lang="ts">
import { containerMaxW } from '@/config.js';
import BaseLevel from '@/components/BaseLevel.vue';
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>&copy;2025, SereinDev.</b>
        Powered by
        <a
          href="https://sereindev.github.io/"
          target="_blank"
          class="text-blue-600"
          >Serein</a
        >.
      </div>
    </BaseLevel>
  </footer>
</template>
