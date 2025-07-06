<script lang="ts" setup>
import BaseIcon from '@/components/BaseIcon.vue';
import { mdiLoading } from '@mdi/js';

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true,
  },
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-80">
    <BaseIcon
      :path="mdiLoading"
      class="animate-spin text-gray-500 dark:text-gray-400"
      size="50"
      w="20"
      h="20"
    />
  </div>
  <slot v-else></slot>
</template>
