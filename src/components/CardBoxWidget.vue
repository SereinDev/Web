<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import CardBox from '@/components/CardBox.vue';
import PillTagTrend from '@/components/PillTagTrend.vue';
import { mdiCog } from '@mdi/js';

defineProps({
  value: {
    type: [String, Number],
    default: undefined,
  },
  icon: {
    type: String,
    default: null,
  },
  prefix: {
    type: String,
    default: null,
  },
  suffix: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  trend: {
    type: String,
    default: null,
  },
  trendType: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <CardBox>
    <BaseLevel v-if="trend" class="mb-3" mobile>
      <PillTagTrend :trend="trend" :trend-type="trendType" small />
      <BaseButton
        :icon="mdiCog"
        icon-w="w-4"
        icon-h="h-4"
        color="lightDark"
        small
      />
    </BaseLevel>
    <BaseLevel mobile>
      <div>
        <h3 class="text-lg leading-tight text-gray-500 dark:text-slate-400">
          {{ label }}
        </h3>
        <h1 class="text-3xl leading-tight font-semibold">
          {{ prefix }}{{ value }}{{ suffix }}
        </h1>
      </div>
      <BaseIcon
        v-if="icon"
        :path="icon"
        size="48"
        w=""
        h="h-16"
        :class="color"
      />
    </BaseLevel>

    <slot></slot>
  </CardBox>
</template>
