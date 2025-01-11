<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import numeral from 'numeral';

const props = defineProps({
  prefix: {
    type: String,
    default: null,
  },
  suffix: {
    type: String,
    default: null,
  },
  value: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 500,
  },
});

const newValue = ref(0);

const newValueFormatted = computed(() =>
  newValue.value < 1000
    ? newValue.value
    : numeral(newValue.value).format('0,0'),
);

const value = computed(() => props.value);

const change = (m: number, up: boolean) => {
  const v = Math.ceil(up ? newValue.value + m : newValue.value - m);

  if (up && v > value.value) {
    newValue.value = value.value;
    return false;
  } else if (!up && v < value.value) {
    newValue.value = value.value;
    return false;
  }

  newValue.value = v;

  setTimeout(() => {
    change(m, up);
  }, 25);
};

const changeInit = (up: boolean = true) => {
  change(props.value / (props.duration / 25), up);
};

watch(value, (v, old) => {
  newValue.value = old;
  changeInit(v > old);
});

onMounted(() => {
  newValue.value = 0;
  changeInit();
});
</script>

<template>
  <div>{{ prefix }}{{ newValueFormatted }}{{ suffix }}</div>
</template>
