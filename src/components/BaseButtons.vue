<script setup lang="ts">
const props = defineProps({
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
    <component
      :is="item"
      v-for="(item, index) in $slots?.default?.() ?? $slots"
      :key="index"
      :class="classAddon"
    />
  </div>
</template>
