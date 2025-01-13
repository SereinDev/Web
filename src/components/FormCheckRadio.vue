<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'checkbox',
    validator: (value) =>
      ['checkbox', 'radio', 'switch'].includes(value as any),
  },
  label: {
    type: String,
    default: null,
  },
  modelValue: {
    type: [Array, String, Number, Boolean],
    default: null,
  },
  inputValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const inputType = computed(() =>
  props.type === 'radio' ? 'radio' : 'checkbox',
);

const classes = computed(() =>
  props.disabled
    ? ['opacity-70', 'cursor-not-allowed', props.type]
    : [props.type],
);
</script>

<template>
  <label :class="classes">
    <input
      v-model="computedValue"
      :type="inputType"
      :name="name"
      :value="inputValue"
      :disabled="disabled"
    />
    <span class="check" />
    <span class="pl-2 select-none">{{ label }}</span>
  </label>
</template>
