<script setup>
defineOptions({
  name: 'BaseButtons',
});

defineProps({
  noWrap: Boolean,
  type: {
    type: String,
    default: 'justify-start',
  },
  classAddon: {
    type: String,
    default: 'mr-3 last:mr-0 mb-3',
  },
  mb: {
    type: String,
    default: '-mb-3',
  },
});
</script>

<template>
  <div
    :class="[
      'flex',
      'items-center',
      type,
      noWrap ? 'flex-nowrap' : 'flex-wrap',
      mb,
    ]"
  >
    <slot />
  </div>
</template>
