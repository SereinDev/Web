<script lang="ts" setup>
import BaseIcon from '@/components/BaseIcon.vue';
import { mdiLoading } from '@mdi/js';

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
    required: true,
  },
  useMask: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="isLoading && !useMask" class="flex justify-center items-center">
    <BaseIcon
      :path="mdiLoading"
      class="animate-spin text-gray-500 dark:text-gray-400"
      size="50"
      w="20"
      h="20"
    />
  </div>
  <slot v-else-if="!useMask"></slot>
  <div v-else class="relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 bg-gray-50/50 dark:bg-slate-800/50"
    >
      <div
        class="flex justify-center items-center fixed inset-0 z-50 pointer-events-none"
      >
        <BaseIcon
          :path="mdiLoading"
          class="animate-spin text-gray-500 dark:text-gray-400"
          size="50"
          w="20"
          h="20"
        />
      </div>
    </div>
    <slot></slot>
  </div>
</template>
