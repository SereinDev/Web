<script setup lang="ts">
import { containerMaxW } from '@/config.ts';
</script>

<template>
  <section class="p-6" :class="containerMaxW">
    <slot />
  </section>
</template>
